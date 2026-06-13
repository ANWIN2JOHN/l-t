export interface PotentialMatch {
  id: string;
  lost_report_id: string;
  found_item_id: string;
  score: number;
  match_reasons: MatchReason[];
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  // Joined data
  lost_report?: {
    id: string;
    title: string;
    category: string;
    location_lost: string;
    date_lost: string;
    description: string;
    student_id: string;
    student?: {
      full_name: string | null;
      email: string;
    };
  };
  found_item?: {
    id: string;
    title: string;
    category: string;
    location_found: string;
    date_found: string;
    description: string;
  };
}

export interface MatchReason {
  criterion: string;
  score: number;
  maxScore: number;
  detail: string;
}

export interface MatchResult {
  lostReportId: string;
  foundItemId: string;
  score: number;
  reasons: MatchReason[];
}