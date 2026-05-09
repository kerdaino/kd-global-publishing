import type { Metadata } from "next";
import Link from "next/link";
import { AdminBookForm, type AdminAuthorOption } from "@/components/admin/AdminBookForm";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create Book",
};

export default async function NewBookPage() {
  await requireAdmin();
  const { data } = await createAdminClient()
    .from("authors")
    .select("id, name")
    .order("name");
  const authors = (data || []) as AdminAuthorOption[];

  return (
    <div>
      <Link
        href="/admin/books"
        className="text-sm font-bold text-red-700 transition hover:text-red-800"
      >
        Back to books
      </Link>
      <h1 className="mt-4 text-4xl font-black text-neutral-950">Create Book</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-650">
        Add a new title to the The Scribe House catalog.
      </p>
      <div className="mt-8">
        <AdminBookForm authors={authors} mode="create" />
      </div>
    </div>
  );
}
