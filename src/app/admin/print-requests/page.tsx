import type { Metadata } from "next";
import { updatePrintRequestStatus } from "@/app/admin/actions";
import { InquiryManagementTable } from "@/components/admin/InquiryManagementTable";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Print Requests" };

type PrintRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  book_title: string | null;
  quantity: string | null;
  book_size: string | null;
  color_preference: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

export default async function AdminPrintRequestsPage() {
  await requireAdmin();
  const { data } = await createAdminClient()
    .from("print_requests")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data || []) as PrintRow[];

  return (
    <InquiryManagementTable
      title="Print Requests"
      description="Track physical print requests and update their status."
      rows={rows}
      action={updatePrintRequestStatus}
      extraHeaders={["Book", "Quantity", "Size"]}
      extraCells={(row) => [
        row.book_title,
        row.quantity ? String(row.quantity) : null,
        row.book_size,
      ]}
    />
  );
}
