export const isAdmin = (role?: string | null) =>
  role?.includes("admin") ?? false;

export const isStudent = (role?: string | null) =>
  role?.includes("student") ?? false;