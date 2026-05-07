"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const authRoutes = new Set(["/admin/login", "/admin/unauthorized"]);

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.has(pathname);

  if (isAuthRoute) {
    return <div className="mx-auto max-w-7xl">{children}</div>;
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <div>{children}</div>
    </div>
  );
}
