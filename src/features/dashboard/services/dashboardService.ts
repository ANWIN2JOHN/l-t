import { supabase } from "@/services/supabase";

export interface DashboardStats {
  totalReported: number;
  lostItems: number;
  foundItems: number;
  returnedItems: number;
}

export const dashboardService = {
  async getGlobalStats(): Promise<DashboardStats> {
    console.log("[getGlobalStats] Fetching statistics...");

    // Total Reported
    const { count: totalReported, error: totalErr } = await supabase
      .from("lost_reports")
      .select("id", { count: "exact", head: true });

    if (totalErr) {
      console.error(
        "[getGlobalStats] Error fetching totalReported:",
        totalErr.message
      );
    }

    // Active Lost Items
    const { count: lostItems, error: lostErr } = await supabase
      .from("lost_reports")
      .select("id", { count: "exact", head: true })
      .in("status", ["SUBMITTED", "APPROVED", "MATCHED"]);

    if (lostErr) {
      console.error(
        "[getGlobalStats] Error fetching lostItems:",
        lostErr.message
      );
    }

    // Found Items
    const { count: foundItems, error: foundErr } = await supabase
      .from("found_items")
      .select("id", { count: "exact", head: true });

    if (foundErr) {
      console.error(
        "[getGlobalStats] Error fetching foundItems:",
        foundErr.message
      );
    }

    // Returned Items
    const { count: returnedItems, error: returnErr } = await supabase
      .from("lost_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "RETURNED");

    if (returnErr) {
      console.error(
        "[getGlobalStats] Error fetching returnedItems:",
        returnErr.message
      );
    }

    const stats: DashboardStats = {
      totalReported: totalReported ?? 0,
      lostItems: lostItems ?? 0,
      foundItems: foundItems ?? 0,
      returnedItems: returnedItems ?? 0,
    };

    console.log("[getGlobalStats] Final Stats:", stats);

    return stats;
  },
};