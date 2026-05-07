import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBookForm, type AdminAuthorOption, type AdminBookFormValue } from "@/components/admin/AdminBookForm";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit Book",
};

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: book }, { data: authors }] = await Promise.all([
    supabase.from("books").select("*").eq("id", id).maybeSingle(),
    supabase.from("authors").select("id, name").order("name"),
  ]);

  if (!book) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/books"
        className="text-sm font-bold text-red-700 transition hover:text-red-800"
      >
        Back to books
      </Link>
      <h1 className="mt-4 text-4xl font-black text-neutral-950">Edit Book</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-650">
        Update catalog details, pricing, publishing status, and file URLs.
      </p>
      <div className="mt-8">
        <AdminBookForm
          authors={(authors || []) as AdminAuthorOption[]}
          book={book as AdminBookFormValue}
          mode="edit"
        />
      </div>
    </div>
  );
}
