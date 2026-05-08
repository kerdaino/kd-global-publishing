import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminBookForm,
  type AdminAuthorOption,
  type AdminBookFormValue,
} from "@/components/admin/AdminBookForm";
import { AdminBookDeleteButton } from "@/components/admin/AdminBookDeleteButton";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Books" };

type BookStatusFilter = "published" | "draft" | "archived";

type BookRow = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  author_id: string | null;
  category: string | null;
  description: string | null;
  short_description: string | null;
  price: number;
  currency: string | null;
  cover_image_url: string | null;
  ebook_file_url: string | null;
  ebook_file_path: string | null;
  sample_file_url: string | null;
  sample_file_path: string | null;
  payment_link: string | null;
  what_readers_will_learn: string[] | null;
  format: string | null;
  status: string | null;
  is_featured: boolean | null;
  is_physical_available: boolean | null;
};

export default async function AdminBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const selectedStatus = getStatusFilter(status);
  const supabase = createAdminClient();
  let booksQuery = supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (selectedStatus) {
    booksQuery = booksQuery.eq("status", selectedStatus);
  }

  const [{ data: books }, { data: authors }] = await Promise.all([
    booksQuery,
    supabase.from("authors").select("id, name").order("name"),
  ]);

  const bookRows = (books || []) as BookRow[];
  const authorRows = (authors || []) as AdminAuthorOption[];

  return (
    <div>
      <h1 className="text-4xl font-black text-neutral-950">Book Management</h1>
      <p className="mt-3 text-neutral-650">
        Create, edit, publish, feature, price, and upload book files.
      </p>
      <Link
        href="/admin/books/new"
        className="mt-6 inline-flex rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
      >
        Create New Book
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterLink label="All" href="/admin/books" active={!selectedStatus} />
        <FilterLink
          label="Published"
          href="/admin/books?status=published"
          active={selectedStatus === "published"}
        />
        <FilterLink
          label="Draft"
          href="/admin/books?status=draft"
          active={selectedStatus === "draft"}
        />
        <FilterLink
          label="Archived"
          href="/admin/books?status=archived"
          active={selectedStatus === "archived"}
        />
      </div>

      <details className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer text-lg font-black text-neutral-950">
          Create Book
        </summary>
        <div className="mt-6">
          <AdminBookForm authors={authorRows} mode="create" />
        </div>
      </details>

      {bookRows.length ? (
        <div className="mt-8 grid gap-6">
          {bookRows.map((book) => (
            <details
              key={book.id}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <summary className="cursor-pointer">
                <span className="inline-flex items-center gap-4 align-middle">
                  {book.cover_image_url ? (
                    <span className="aspect-[5/8] w-14 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={book.cover_image_url}
                        alt={`${book.title} cover`}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  ) : null}
                  <span>
                    <span className="font-black text-neutral-950">{book.title}</span>
                    <span className="ml-3 rounded-md bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700">
                      {book.status}
                    </span>
                    {book.is_featured ? (
                      <span className="ml-2 rounded-md bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                        Featured
                      </span>
                    ) : null}
                  </span>
                </span>
              </summary>
              <Link
                href={`/admin/books/${book.id}/edit`}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-neutral-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Open full editor
              </Link>
              <div className="mt-5 rounded-md border border-red-100 bg-red-50/40 p-4">
                <p className="mb-3 text-sm font-semibold text-neutral-700">
                  Delete archives this book by setting its status to archived.
                </p>
                <AdminBookDeleteButton bookId={book.id} bookTitle={book.title} />
              </div>
              <div className="mt-5">
                <AdminBookForm
                  authors={authorRows}
                  book={book as AdminBookFormValue}
                  mode="edit"
                />
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 text-neutral-650 shadow-sm">
          No books have been created yet. Use the create form above to add the
          first KD Global Publishing House title.
        </div>
      )}
    </div>
  );
}

function getStatusFilter(value: string | string[] | undefined): BookStatusFilter | null {
  const status = Array.isArray(value) ? value[0] : value;

  return status === "published" || status === "draft" || status === "archived"
    ? status
    : null;
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "inline-flex min-h-11 items-center justify-center rounded-md bg-neutral-950 px-4 py-2 text-sm font-bold text-white"
          : "inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-700 transition hover:border-red-700 hover:text-red-700"
      }
    >
      {label}
    </Link>
  );
}
