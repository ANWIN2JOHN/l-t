/**
 * src/store/authStore.ts
 *
 * Zustand auth store.
 * Per FRONTEND_ARCHITECTURE.md — Zustand is used only for auth + theme.
 * Per SUPABASE_AUTH_SETUP.md — store: user, profile, role, isAuthenticated, isLoading.
 *
 * This store is populated in Phase 2 (Authentication).
 * Phase 1: Structure and types only.
 */

import { create } from "zustand";
import type { Profile, AuthUser } from "@/types";

interface AuthStore {
  // State
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions (implemented in Phase 2)
  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state — unauthenticated
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true, // true on mount until session is checked

  setUser: (user) =>
    set({ user, isAuthenticated: user !== null }),

  setProfile: (profile) =>
    set({ profile }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  logout: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
