import type { Metadata } from "next";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";
import type { AdminStat } from "@/types";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

async function getCount(table: string, filter?: { column: string; value: string }) {
  const supabase = createAdminClient();
  let query = supabase.from(table).select("*", { count: "exact", head: true });

  if (filter) {
    query = query.eq(filter.column, filter.value);
  }

  const { count } = await query;
  return count || 0;
}

export default async function AdminPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const [
    totalBooks,
    totalOrders,
    pendingInquiries,
    sermonProjects,
    printRequests,
    paidOrders,
  ] = await Promise.all([
    getCount("books"),
    getCount("orders"),
    getCount("publishing_inquiries", { column: "status", value: "new" }),
    getCount("sermon_book_projects"),
    getCount("print_requests"),
    supabase.from("orders").select("amount").eq("payment_status", "paid"),
  ]);

  const totalRevenue =
    paidOrders.data?.reduce(
      (sum, order) => sum + Number((order as { amount: number }).amount || 0),
      0,
    ) || 0;

  const stats: AdminStat[] = [
    { label: "Total Books", value: String(totalBooks), note: "All catalog records." },
    { label: "Total Orders", value: String(totalOrders), note: "Paystack checkout records." },
    { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString("en-NG")}`, note: "Paid order revenue." },
    { label: "Pending Inquiries", value: String(pendingInquiries), note: "New publishing inquiries." },
    { label: "Sermon Projects", value: String(sermonProjects), note: "Sermon-to-book requests." },
    { label: "Print Requests", value: String(printRequests), note: "Physical print requests." },
  ];

  return (
    <div>
      <h1 className="text-4xl font-black text-neutral-950">Admin Dashboard</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-650">
        Manage books, orders, inquiries, sermon projects, and print requests for
        The Scribe House.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <AdminStatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}
