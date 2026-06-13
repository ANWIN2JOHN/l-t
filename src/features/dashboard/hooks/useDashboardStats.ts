import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const DASHBOARD_STATS_QUERY_KEY = ["dashboard-stats"];

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: () => dashboardService.getGlobalStats(),
  });
}
