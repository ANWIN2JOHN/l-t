import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { isAdmin, isStudent } from "@/utils/roles";

interface RoleGuardProps {
  allowedRoles: Role[];
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.STUDENT_LOGIN} replace />;
  }

  const hasAccess = allowedRoles.some((allowedRole) => {
    if (allowedRole === "admin") {
      return isAdmin(role);
    }

    if (allowedRole === "student") {
      return isStudent(role);
    }

    return false;
  });

  if (!hasAccess) {
    const redirect = isAdmin(role)
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.STUDENT_DASHBOARD;

    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}