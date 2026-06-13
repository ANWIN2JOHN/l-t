/**
 * src/hooks/useAuth.ts
 *
 * Shared hook for accessing auth state.
 * Wraps the Zustand authStore for clean component consumption.
 *
 * Usage:
 *   const { user, profile, isAuthenticated, isLoading } = useAuth();
 */

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  const role = profile?.role ?? null;
  const receptionId = profile?.reception_id ?? null;
  const accountStatus = profile?.account_status ?? null;

  return {
    user,
    profile,
    role,
    receptionId,
    accountStatus,
    isAuthenticated,
    isLoading,
    logout,
  };
}
