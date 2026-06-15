/**
 * src/routes/RoleGuard.tsx
 *
 * Role-based access guard.
 * Per USER_ROLES.md — enforces role restrictions at the route level.
 *
 * Usage (standalone, inside an already-authenticated route):
 *   <RoleGuard allowedRoles={["admin"]} />
 *
 * Or as a wrapper:
 *   <Route element={<RoleGuard allowedRoles={["admin"]} />}>
 *     <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
 *   </Route>
 */

import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";

interface RoleGuardProps {
  allowedRoles: Role[];
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.STUDENT_LOGIN} replace />;
  }

  if (!role || !allowedRoles.includes(role as Role)) {
    // Redirect to the user's own dashboard
    const redirect =
  role === "admin"
    ? ROUTES.ADMIN_DASHBOARD
    : ROUTES.STUDENT_DASHBOARD;
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
