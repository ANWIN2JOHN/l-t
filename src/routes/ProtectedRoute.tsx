import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { isAdmin, isStudent } from "@/utils/roles";

interface ProtectedRouteProps {
  requiredRole?: Role;
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.STUDENT_LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  if (requiredRole) {
    const hasRequiredRole =
      requiredRole === "admin"
        ? isAdmin(role)
        : isStudent(role);

    if (!hasRequiredRole) {
      const redirect = isAdmin(role)
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.STUDENT_DASHBOARD;

      return <Navigate to={redirect} replace />;
    }
  }

  return <Outlet />;
}