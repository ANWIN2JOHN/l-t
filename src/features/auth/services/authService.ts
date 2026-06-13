/**
 * src/features/auth/services/authService.ts
 *
 * Authentication service handling Google OAuth and profile loading.
 * Roll number validation and registration completion have been removed.
 * The only auth restriction is the @kristujayanti.com email domain.
 */

import { supabase } from "@/services/supabase";
import type { Profile } from "@/types";

export const authService = {
  /**
   * Initiate Google OAuth login.
   */
  async loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  },

  /**
   * Log the user out of Supabase.
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Load the profile for a given user ID.
   */
  async loadProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as Profile;
  },
};
