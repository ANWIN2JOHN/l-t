/**
 * src/services/supabase.ts
 *
 * Supabase client singleton.
 * Import this file wherever Supabase access is needed.
 *
 * Usage:
 *   import { supabase } from "@/services/supabase";
 *   const { data, error } = await supabase.from("profiles").select("*");
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      // Use Supabase session management — do not implement custom JWT.
      // Per SUPABASE_AUTH_SETUP.md and AUTH_FLOW.md.
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
