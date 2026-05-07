import { AdminShell } from "@/components/admin/AdminShell";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-neutral-50 px-6 py-10 sm:py-12">
      <AdminShell>{children}</AdminShell>
    </section>
  );
}
