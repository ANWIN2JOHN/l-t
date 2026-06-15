/**
 * src/routes/ProtectedRoute.tsx
 *
 * Route guard — requires authentication.
 * Per AUTH_FLOW.md and FRONTEND_RULES.md.
 *
 * Usage (in router):
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<StudentDashboard />} />
 *   </Route>
 *
 * With role restriction:
 *   <Route element={<ProtectedRoute requiredRole="admin" />}>
 *     <Route path="/admin" element={<AdminView />} />
 *   </Route>
 */

import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";

interface ProtectedRouteProps {
  requiredRole?: Role;
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  // While session is being resolved — show nothing (spinner added in Phase 2)
  if (isLoading) {
    return null;
  }

  // Not authenticated — redirect to login, preserve attempted URL
  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.STUDENT_LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  // Role check — redirect to correct dashboard if wrong role
  if (requiredRole && role !== requiredRole) {
    const redirect =
  role === "admin"
    ? ROUTES.ADMIN_DASHBOARD
    : ROUTES.STUDENT_DASHBOARD;
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
