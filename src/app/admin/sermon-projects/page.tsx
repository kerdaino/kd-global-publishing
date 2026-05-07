import type { Metadata } from "next";
import { updateSermonProjectStatus } from "@/app/admin/actions";
import { InquiryManagementTable } from "@/components/admin/InquiryManagementTable";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Sermon Projects" };

type SermonRow = {
  id: string;
  full_name: string;
  ministry_name: string | null;
  email: string;
  phone: string | null;
  sermon_format: string | null;
  number_of_sermons: string | null;
  project_goal: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

export default async function AdminSermonProjectsPage() {
  await requireAdmin();
  const { data } = await createAdminClient()
    .from("sermon_book_projects")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data || []) as SermonRow[];

  return (
    <InquiryManagementTable
      title="Sermon-to-Book Projects"
      description="Track sermon-to-book inquiries and update their project status."
      rows={rows}
      action={updateSermonProjectStatus}
      extraHeaders={["Ministry", "Format", "Goal"]}
      extraCells={(row) => [row.ministry_name, row.sermon_format, row.project_goal]}
    />
  );
}
