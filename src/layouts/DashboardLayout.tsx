/**
 * src/layouts/DashboardLayout.tsx
 *
 * Layout wrapper for authenticated dashboard screens.
 */

import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared dashboard navigation / sidebar can be placed here */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
