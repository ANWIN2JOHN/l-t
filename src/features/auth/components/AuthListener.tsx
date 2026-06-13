/**
 * src/features/auth/components/AuthListener.tsx
 *
 * Listens to Supabase auth state changes, manages the Zustand auth store,
 * and handles domain validation and dashboard routing.
 *
 * Design:
 *  - onAuthStateChange is the SINGLE source of truth.
 *  - getSession() on boot handles the page-refresh / returning-user case.
 *    It does NOT call loadProfile() if onAuthStateChange already covered it.
 *  - INITIAL_SESSION events are explicitly ignored to avoid running
 *    loadProfile() before the JWT is committed to the Supabase client.
 *  - A profileFetched ref guards against duplicate fetches.
 *  - Authentication restriction: @kristujayanti.com email domain only.
 *  - No roll number validation. Users go directly to their dashboard.
 */

import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { supabase } from "@/services/supabase";
import { useAuthStore } from "@/store/authStore";
import { authService } from "../services/authService";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

export default function AuthListener({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);
  const logoutState = useAuthStore((state) => state.logout);

  // Prevent duplicate profile fetches across getSession() boot + SIGNED_IN event
  const profileFetched = useRef(false);

  useEffect(() => {
    let mounted = true;

    /**
     * Core handler: validate domain, load profile, and route to dashboard.
     * Only called when we have a confirmed authenticated session with a JWT.
     */
    const loadProfile = async (session: any) => {
      if (!session?.user) return;

      // Guard: skip if already fetched within this mount cycle
      if (profileFetched.current) {
        console.log("Session user:", session.user.id, "— profile already fetched, skipping.");
        return;
      }
      profileFetched.current = true;

      const user = session.user;
      console.log("Session user:", user.id);
      console.log("Loading profile:", user.id);

      // 1. Domain validation — only @kristujayanti.com accounts allowed
      if (user.email && !user.email.endsWith("@kristujayanti.com")) {
        toast.error("Access Denied", {
          description: "Only @kristujayanti.com accounts are allowed.",
        });
        await authService.logout();
        if (mounted) {
          logoutState();
          setLoading(false);
          navigate(ROUTES.LOGIN);
        }
        return;
      }

      // 2. Load profile — JWT is committed so RLS will pass
      try {
        const profile = await authService.loadProfile(user.id);

        if (mounted) {
          setUser({ id: user.id, email: user.email });
          setProfile(profile);
          setLoading(false);

          const dashboard =
            profile.role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD;

          console.log("Profile role:", profile.role);
          console.log("Current pathname:", location.pathname);
          console.log("Target dashboard:", dashboard);

          // Navigate to dashboard unless the user is already on a protected route.
          // This covers all cases:
          //   - Post-OAuth redirect lands on "/" (landing page)
          //   - Login page (/login, /student-login)
          //   - Any other public page
          const alreadyOnDashboard =
            location.pathname.startsWith(ROUTES.ADMIN_DASHBOARD) ||
            location.pathname.startsWith(ROUTES.STUDENT_DASHBOARD);

          if (!alreadyOnDashboard) {
            console.log("Navigating to:", dashboard);
            navigate(dashboard, { replace: true });
          } else {
            console.log("Already on dashboard, no navigation needed.");
          }
        }
      } catch (err: any) {
        console.error("Error loading profile:", err);
        toast.error("Authentication Error", { description: "Failed to load user profile." });
        await authService.logout();
        if (mounted) {
          logoutState();
          setLoading(false);
        }
      }
    };

    // ─── onAuthStateChange: single source of truth ───────────────────────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, "| Session user:", session?.user?.id ?? "none");

      // INITIAL_SESSION fires before the JWT is usable — ignore it entirely.
      // The boot getSession() check below handles the page-refresh case.
      if (event === "INITIAL_SESSION") return;

      if (event === "SIGNED_IN" && session) {
        loadProfile(session);
        return;
      }

      if (event === "SIGNED_OUT") {
        profileFetched.current = false;
        if (mounted) {
          logoutState();
          setLoading(false);
        }
        return;
      }

      // TOKEN_REFRESHED / USER_UPDATED with no session → clear state
      if ((event === "TOKEN_REFRESHED" || event === "USER_UPDATED") && !session) {
        if (mounted) {
          logoutState();
          setLoading(false);
        }
      }
    });

    // ─── Boot: handle page refresh where SIGNED_IN won't re-fire ─────────────
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      console.log("Boot getSession — Session user:", session?.user?.id ?? "none");

      if (session?.user) {
        // A valid session exists (page refresh / returning user).
        // JWT is persisted in localStorage — safe to call loadProfile().
        loadProfile(session);
      } else {
        // No session on boot — clear loading state so UI can render login.
        logoutState();
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
