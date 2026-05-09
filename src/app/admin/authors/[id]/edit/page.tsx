import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminAuthorDeleteButton } from "@/components/admin/AdminAuthorDeleteButton";
import { AdminAuthorForm, type AdminAuthorFormValue } from "@/components/admin/AdminAuthorForm";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit Author",
};

export default async function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: author }, { data: books }] = await Promise.all([
    supabase.from("authors").select("*").eq("id", id).maybeSingle(),
    supabase.from("books").select("id, title, status").eq("author_id", id).order("created_at", { ascending: false }),
  ]);

  if (!author) {
    notFound();
  }

  const authorName = String((author as { name?: string | null }).name || "this author");
  const authorBooks = (books || []) as { id: string; title: string; status: string | null }[];

  return (
    <div>
      <Link
        href="/admin/authors"
        className="text-sm font-bold text-red-700 transition hover:text-red-800"
      >
        Back to authors
      </Link>
      <h1 className="mt-4 text-4xl font-black text-neutral-950">Edit Author</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-650">
        Update profile details, public status, social links, and author image.
      </p>
      <div className="mt-8">
        <AdminAuthorForm author={author as AdminAuthorFormValue} mode="edit" />
      </div>

      <section className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-neutral-950">Books by this author</h2>
        {authorBooks.length ? (
          <div className="mt-5 grid gap-3">
            {authorBooks.map((book) => (
              <div
                key={book.id}
                className="flex flex-col gap-2 rounded-md border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-semibold text-neutral-950">{book.title}</span>
                <span className="w-fit rounded-md bg-neutral-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-700">
                  {book.status || "draft"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-md border border-neutral-200 bg-neutral-50 p-5 text-neutral-650">
            No books are connected to this author yet.
          </div>
        )}
      </section>

      <section className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-2xl font-black text-neutral-950">Danger Zone</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">
          Permanent deletion is only allowed when this author has no books.
          If books exist, keep the record and hide the author instead.
        </p>
        <div className="mt-5">
          <AdminAuthorDeleteButton
            authorId={id}
            authorName={authorName}
            hardDelete
            disabled={authorBooks.length > 0}
          />
        </div>
        {authorBooks.length > 0 ? (
          <p className="mt-3 text-sm font-semibold text-red-700">
            Hard delete is blocked because this author has connected books.
          </p>
        ) : null}
      </section>
    </div>
  );
}
