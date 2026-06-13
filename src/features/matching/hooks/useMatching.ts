import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchingService } from "../services/matchingService";
import { toast } from "sonner";

export const POTENTIAL_MATCHES_KEY = ["potential-matches"];
export const ALL_MATCHES_KEY = ["all-matches"];
export const MATCH_STATS_KEY = ["match-stats"];

export function usePotentialMatches() {
  return useQuery({
    queryKey: POTENTIAL_MATCHES_KEY,
    queryFn: () => matchingService.getPendingMatches(),
  });
}

export function useAllMatches() {
  return useQuery({
    queryKey: ALL_MATCHES_KEY,
    queryFn: () => matchingService.getAllMatches(),
  });
}

export function useMatchStats() {
  return useQuery({
    queryKey: MATCH_STATS_KEY,
    queryFn: () => matchingService.getMatchStats(),
  });
}

export function useFindMatches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => matchingService.findPotentialMatches(),
    onSuccess: (results) => {
      if (results.length > 0) {
        toast.success(`Found ${results.length} potential match(es)!`);
      } else {
        toast.info("No new matches found.");
      }
      queryClient.invalidateQueries({ queryKey: POTENTIAL_MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: MATCH_STATS_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err: any) => {
      console.error("[useFindMatches] Error:", err);
      toast.error(err.message || "Failed to run matching");
    },
  });
}

export function useAcceptMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => matchingService.acceptMatch(matchId),
    onSuccess: () => {
      toast.success("Match accepted successfully!");
      queryClient.invalidateQueries({ queryKey: POTENTIAL_MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: MATCH_STATS_KEY });
      queryClient.invalidateQueries({ queryKey: ["found-items"] });
      queryClient.invalidateQueries({ queryKey: ["browse-found-items"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: any) => {
      console.error("[useAcceptMatch] Error:", err);
      toast.error(err.message || "Failed to accept match");
    },
  });
}

export function useRejectMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => matchingService.rejectMatch(matchId),
    onSuccess: () => {
      toast.success("Match rejected.");
      queryClient.invalidateQueries({ queryKey: POTENTIAL_MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: MATCH_STATS_KEY });
    },
    onError: (err: any) => {
      console.error("[useRejectMatch] Error:", err);
      toast.error(err.message || "Failed to reject match");
    },
  });
}