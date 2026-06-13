import { LostReportStatus } from "../constants/statusConstants";

export interface LostReport {
  id: string;
  student_id: string;
  title: string;
  category: string;
  location_lost: string;
  date_lost: string;
  description: string;
  contact_information: string;
  unique_identifiers?: string | null;
  status: LostReportStatus;
  admin_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  linked_found_item_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type LostReportInsert = Omit<
  LostReport,
  "id" | "student_id" | "status" | "admin_notes" | "reviewed_by" | "reviewed_at" | "linked_found_item_id" | "created_at" | "updated_at"
>;

export type LostReportUpdate = Partial<LostReportInsert>;
