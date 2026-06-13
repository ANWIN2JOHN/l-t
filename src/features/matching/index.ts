export { matchingService } from "./services/matchingService";
export {
  usePotentialMatches,
  useAllMatches,
  useMatchStats,
  useFindMatches,
  useAcceptMatch,
  useRejectMatch,
} from "./hooks/useMatching";
export type { PotentialMatch, MatchResult, MatchReason } from "./types";