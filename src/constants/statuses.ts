/**
 * src/constants/statuses.ts
 *
 * Item and account status constants.
 * Per APP_REQUIREMENTS.md — Lost Report and Found Item lifecycle statuses.
 */

// Lost Report statuses — per APP_REQUIREMENTS.md
export const LOST_REPORT_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  NEEDS_REVISION: "NEEDS_REVISION",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CLOSED: "CLOSED",
} as const;

export type LostReportStatus =
  (typeof LOST_REPORT_STATUS)[keyof typeof LOST_REPORT_STATUS];

// Statuses where students can still edit their report
export const STUDENT_EDITABLE_STATUSES: LostReportStatus[] = [
  LOST_REPORT_STATUS.DRAFT,
  LOST_REPORT_STATUS.SUBMITTED,
  LOST_REPORT_STATUS.NEEDS_REVISION,
];

// Found Item statuses — per APP_REQUIREMENTS.md
export const FOUND_ITEM_STATUS = {
  AVAILABLE: "AVAILABLE",
  MATCHED: "MATCHED",
  RETURNED: "RETURNED",
  EXPIRED: "EXPIRED",
  DONATED: "DONATED",
  ARCHIVED: "ARCHIVED",
} as const;

export type FoundItemStatus =
  (typeof FOUND_ITEM_STATUS)[keyof typeof FOUND_ITEM_STATUS];

// Account statuses — per AUTH_FLOW.md
export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DEACTIVATED: "DEACTIVATED",
} as const;

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];
