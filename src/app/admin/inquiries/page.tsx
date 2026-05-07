import type { Metadata } from "next";
import { updatePublishingInquiryStatus } from "@/app/admin/actions";
import { InquiryManagementTable } from "@/components/admin/InquiryManagementTable";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Inquiries" };

type InquiryRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  book_title: string | null;
  project_stage: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const { data } = await createAdminClient()
    .from("publishing_inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  const inquiries = (data || []) as InquiryRow[];

  return (
    <InquiryManagementTable
      title="Publishing Inquiries"
      description="Review publishing service inquiries and update their status."
      rows={inquiries}
      action={updatePublishingInquiryStatus}
      extraHeaders={["Book", "Stage"]}
      extraCells={(row) => [row.book_title, row.project_stage]}
    />
  );
}
