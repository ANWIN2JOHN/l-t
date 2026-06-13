import { supabase } from "@/services/supabase";
import { auditService } from "@/features/audit/services/auditService";
import { LostReport, LostReportInsert, LostReportUpdate } from "../types";
import { LOST_REPORT_STATUSES, EDITABLE_STATUSES } from "../constants/statusConstants";
import { notificationService } from "@/features/notifications/services/notificationService";

export const lostReportService = {
  async createReport(data: LostReportInsert): Promise<LostReport> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    if (data.date_lost) {
      const selectedDate = new Date(data.date_lost);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate > today) throw new Error("Date lost cannot be in the future");
    }

    const { data: report, error } = await supabase
      .from("lost_reports")
      .insert({
        ...data,
        student_id: user.id,
        status: LOST_REPORT_STATUSES.SUBMITTED,
      })
      .select()
      .single();

    if (error) throw error;

    // Async audit log without blocking
    void auditService.logAction("CREATE_LOST_REPORT", "lost_report", report.id);

    // Notify user
    void notificationService.createNotification(
      user.id,
      "NEW_LOST_REPORT",
      "Report Submitted",
      "Your lost item report has been submitted successfully."
    );

    return report;
  },

  async updateReport(id: string, data: LostReportUpdate): Promise<LostReport> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // First check if it's editable
    const { data: existingReport, error: fetchError } = await supabase
      .from("lost_reports")
      .select("status")
      .eq("id", id)
      .eq("student_id", user.id)
      .single();

    if (fetchError) throw fetchError;

    if (!EDITABLE_STATUSES.includes(existingReport.status)) {
      throw new Error(`Cannot edit report in ${existingReport.status} status.`);
    }

    if (data.date_lost) {
      const selectedDate = new Date(data.date_lost);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate > today) throw new Error("Date lost cannot be in the future");
    }

    const { data: updatedReport, error } = await supabase
      .from("lost_reports")
      .update(data)
      .eq("id", id)
      .eq("student_id", user.id) // Extra safety check
      .select()
      .single();

    if (error) throw error;

    void auditService.logAction("UPDATE_LOST_REPORT", "lost_report", updatedReport.id, { changes: Object.keys(data) });

    return updatedReport;
  },

  async getMyReports(): Promise<LostReport[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: reports, error } = await supabase
      .from("lost_reports")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return reports;
  },

  async getReportById(id: string): Promise<LostReport> {
    const { data: report, error } = await supabase
      .from("lost_reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return report;
  },

  async getPendingReports(): Promise<LostReport[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: reports, error } = await supabase
      .from("lost_reports")
      .select(`
        *,
        student:profiles!lost_reports_student_id_fkey(
          id,
          email,
          full_name,
          roll_number
        ),
        reviewer:profiles!lost_reports_reviewed_by_fkey(
          id,
          email,
          full_name
        )
      `)
      .eq("status", LOST_REPORT_STATUSES.SUBMITTED)
      .order("created_at", { ascending: false });

    console.log("[getPendingReports] Query result:", reports);
    console.log("[getPendingReports] Query error:", error);
    console.log("[getPendingReports] Row count:", reports?.length ?? 0);

    if (error) {
      console.error("[getPendingReports] Full Supabase error:", JSON.stringify(error, null, 2));
      throw error;
    }
    return reports as LostReport[];
  },

  async getApprovedLostReports(): Promise<LostReport[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: reports, error } = await supabase
      .from("lost_reports")
      .select(`
        *,
        student:profiles!lost_reports_student_id_fkey(
          id,
          email,
          full_name,
          roll_number
        )
      `)
      .in("status", [LOST_REPORT_STATUSES.APPROVED, LOST_REPORT_STATUSES.MATCHED, LOST_REPORT_STATUSES.RETURNED])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getApprovedLostReports] Full Supabase error:", JSON.stringify(error, null, 2));
      throw error;
    }
    return reports as LostReport[];
  },

  async resolveReport(id: string, approved: boolean): Promise<LostReport> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const status = approved
    ? LOST_REPORT_STATUSES.APPROVED
    : LOST_REPORT_STATUSES.REJECTED;

  const { data: report, error } = await supabase
    .from("lost_reports")
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Audit Log
  void auditService.logAction(
    approved ? "APPROVE_LOST_REPORT" : "REJECT_LOST_REPORT",
    "lost_report",
    id
  );

  // Notification
  void notificationService.createNotification(
    report.student_id,
    approved ? "REPORT_APPROVED" : "REPORT_REJECTED",
    approved ? "Report Approved" : "Report Rejected",
    approved
      ? "Your lost item report has been approved by the administration."
      : "Your lost item report was rejected. Please review the remarks."
  );

  // NEW: Trigger Intelligent Matching Engine
  if (approved) {
    import("@/features/matching/services/matchingService")
      .then(({ matchingService }) => {
        void matchingService.findPotentialMatches();
      })
      .catch((err) => {
        console.error(
          "[Matching Engine] Failed to generate matches:",
          err
        );
      });
  }

  return report;
}
};