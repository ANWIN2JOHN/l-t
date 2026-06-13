/**
 * src/constants/roles.ts
 *
 * User role constants.
 * Per USER_ROLES.md — never hardcode role strings directly.
 */

export const ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
