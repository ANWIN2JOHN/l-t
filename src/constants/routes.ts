/**
 * src/constants/routes.ts
 *
 * Application route path constants.
 * Per AUTH_FLOW.md route definitions.
 * Never hardcode route strings — always import from here.
 */

export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  ROLE_SELECTION: "/role-selection",
  STUDENT_LOGIN: "/student-login",
  BROWSE_LOST: "/browse-lost",
  BROWSE_FOUND: "/browse-found",

  // Student (protected — role: student)
  STUDENT_DASHBOARD: "/dashboard",
  MY_REPORTS: "/my-reports",
  FOUND_ITEMS: "/found-items",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",

  // Admin (protected — role: admin)
  ADMIN_DASHBOARD: "/admin",
  ADMIN_LOST_REPORTS: "/admin/lost-reports",
  ADMIN_FOUND_ITEMS: "/admin/found-items",
  ADMIN_USERS: "/admin/users",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
  ADMIN_AUDIT_LOGS: "/admin/audit-logs",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
