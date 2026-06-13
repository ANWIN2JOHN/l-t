/**
 * src/layouts/AppLayout.tsx
 *
 * Top-level application layout.
 * Wraps the entire application routing tree.
 */

import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function AppLayout() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
