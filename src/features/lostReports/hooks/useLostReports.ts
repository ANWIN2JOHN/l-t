import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lostReportService } from "../services/lostReportService";
import { LostReportInsert, LostReportUpdate } from "../types";
import { toast } from "sonner";

export const LOST_REPORTS_QUERY_KEY = ["my-lost-reports"];

export function useMyReports() {
  return useQuery({
    queryKey: LOST_REPORTS_QUERY_KEY,
    queryFn: () => lostReportService.getMyReports(),
  });
}

export function useCreateLostReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LostReportInsert) => lostReportService.createReport(data),
    onSuccess: () => {
      toast.success("Lost report submitted successfully!");
      queryClient.invalidateQueries({ queryKey: LOST_REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to submit report");
    },
  });
}

export function useUpdateLostReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LostReportUpdate }) => lostReportService.updateReport(id, data),
    onSuccess: () => {
      toast.success("Report updated successfully!");
      queryClient.invalidateQueries({ queryKey: LOST_REPORTS_QUERY_KEY });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to update report");
    },
  });
}

export const PENDING_REPORTS_QUERY_KEY = ["pending-lost-reports"];

export const APPROVED_REPORTS_QUERY_KEY = ["approved-lost-reports"];

export function useApprovedLostReports() {
  return useQuery({
    queryKey: APPROVED_REPORTS_QUERY_KEY,
    queryFn: () => lostReportService.getApprovedLostReports(),
  });
}

export function usePendingReports() {
  return useQuery({
    queryKey: PENDING_REPORTS_QUERY_KEY,
    queryFn: async () => {
      const result = await lostReportService.getPendingReports();
      console.log("[usePendingReports] Hook received data:", result);
      return result;
    },
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => lostReportService.resolveReport(id, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LOST_REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: APPROVED_REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to resolve report");
    },
  });
}
