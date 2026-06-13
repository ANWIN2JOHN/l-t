/**
 * src/lib/env.ts
 *
 * Environment variable validation.
 * Application will throw at startup if required variables are missing.
 */

const requiredVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

function validateEnv(): typeof requiredVars {
  const missing: string[] = [];

  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value || value.trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[Campus L&F] Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}\n\nCopy .env.example to .env.local and fill in the values.`
    );
  }

  return requiredVars;
}

export const env = validateEnv();
