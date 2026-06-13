/**
 * src/types/index.ts
 *
 * Shared application types.
 * Per SUPABASE_SCHEMA.md — matches database table structure exactly.
 */

import type { Role } from "@/constants/roles";
import type { AccountStatus } from "@/constants/statuses";
import type { LostReportStatus, FoundItemStatus } from "@/constants/statuses";

// ─── User / Profile ────────────────────────────────────────────────────────

export interface Profile {
  id: string; // uuid — matches auth.users(id)
  email: string;
  full_name: string | null;
  roll_number: string | null;
  role: Role;
  reception_id: string | null; // uuid — null for students
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

// ─── Reception ─────────────────────────────────────────────────────────────

export interface Reception {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
}

// ─── Lost Report ───────────────────────────────────────────────────────────

export interface LostReport {
  id: string;
  student_id: string;
  title: string;
  category: string;
  location_lost: string;
  date_lost: string; // ISO date string
  description: string;
  contact_information: string;
  unique_identifiers: string | null;
  status: LostReportStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  linked_found_item_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Found Item ────────────────────────────────────────────────────────────

export interface FoundItem {
  id: string;
  title: string;
  category: string;
  description: string;
  location_found: string;
  date_found: string; // ISO date string
  reception_id: string;
  status: FoundItemStatus;
  linked_lost_report_id: string | null;
  created_by: string;
  returned_by: string | null;
  returned_at: string | null;
  expires_at: string | null;
  created_at: string;
}

// ─── Notification ──────────────────────────────────────────────────────────

export type NotificationType =
  | "REPORT_APPROVED"
  | "REPORT_REJECTED"
  | "REPORT_UPDATED"
  | "REPORT_CLOSED"
  | "NEW_USER_REGISTERED"
  | "NEW_LOST_REPORT"
  | "ITEM_RETURNED"
  | "ITEM_DONATED";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ─── Audit Log ─────────────────────────────────────────────────────────────

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE_USER"
  | "UPDATE_USER"
  | "SUSPEND_USER"
  | "DEACTIVATE_USER"
  | "CREATE_LOST_REPORT"
  | "UPDATE_LOST_REPORT"
  | "APPROVE_REPORT"
  | "REJECT_REPORT"
  | "REQUEST_REVISION"
  | "CLOSE_REPORT"
  | "CREATE_FOUND_ITEM"
  | "UPDATE_FOUND_ITEM"
  | "MATCH_FOUND_ITEM"
  | "RETURN_ITEM"
  | "DONATE_ITEM"
  | "ARCHIVE_ITEM"
  | "TRANSFER_ITEM";

export interface AuditLog {
  id: string;
  action: AuditAction;
  performed_by: string;
  reception_id: string | null;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Valid Roll Numbers ────────────────────────────────────────────────────

export interface ValidRollNumber {
  id: string;
  roll_number: string;
  is_used: boolean;
  is_active: boolean;
  created_at: string;
}

// ─── Auth State ────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
