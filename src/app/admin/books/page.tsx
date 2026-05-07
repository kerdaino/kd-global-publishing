import type { Metadata } from "next";
import Link from "next/link";
import { createBook, updateBook } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Books" };

type AuthorOption = { id: string; name: string };
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
  format: string | null;
  status: string | null;
  is_featured: boolean | null;
  is_physical_available: boolean | null;
};

export default async function AdminBooksPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const [{ data: books }, { data: authors }] = await Promise.all([
    supabase.from("books").select("*").order("created_at", { ascending: false }),
    supabase.from("authors").select("id, name").order("name"),
  ]);

  const bookRows = (books || []) as BookRow[];
  const authorRows = (authors || []) as AuthorOption[];

  return (
    <div>
      <h1 className="text-4xl font-black text-neutral-950">Book Management</h1>
      <p className="mt-3 text-neutral-650">
        Create, edit, publish, feature, price, and attach cover/eBook URLs.
      </p>
      <Link
        href="/admin/books/new"
        className="mt-6 inline-flex rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
      >
        Create New Book
      </Link>

      <details className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer text-lg font-black text-neutral-950">
          Create Book
        </summary>
        <BookForm action={createBook} authors={authorRows} />
      </details>

      {bookRows.length ? (
        <div className="mt-8 grid gap-6">
          {bookRows.map((book) => (
            <details
              key={book.id}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <summary className="cursor-pointer">
                <span className="font-black text-neutral-950">{book.title}</span>
                <span className="ml-3 rounded-md bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700">
                  {book.status}
                </span>
                {book.is_featured ? (
                  <span className="ml-2 rounded-md bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                    Featured
                  </span>
                ) : null}
              </summary>
              <Link
                href={`/admin/books/${book.id}/edit`}
                className="mt-5 inline-flex rounded-md bg-neutral-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Open full editor
              </Link>
              <BookForm action={updateBook} authors={authorRows} book={book} />
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

function BookForm({
  action,
  authors,
  book,
}: {
  action: (formData: FormData) => Promise<void>;
  authors: AuthorOption[];
  book?: BookRow;
}) {
  return (
    <form action={action} className="mt-6 grid gap-5">
      {book ? <input type="hidden" name="id" value={book.id} /> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <AdminInput label="Title" name="title" defaultValue={book?.title} required />
        <AdminInput label="Slug" name="slug" defaultValue={book?.slug} required />
        <AdminInput label="Subtitle" name="subtitle" defaultValue={book?.subtitle} />
        <label className="grid gap-2 text-sm font-semibold text-neutral-800">
          Author
          <select
            name="author_id"
            defaultValue={book?.author_id || ""}
            className="min-h-12 rounded-md border border-neutral-300 px-4"
          >
            <option value="">No author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <AdminInput label="Category" name="category" defaultValue={book?.category} />
        <AdminInput label="Price" name="price" type="number" defaultValue={book?.price} required />
        <AdminInput label="Currency" name="currency" defaultValue={book?.currency || "NGN"} />
        <AdminInput label="Format" name="format" defaultValue={book?.format || "PDF eBook"} />
        <AdminInput label="Cover image URL" name="cover_image_url" defaultValue={book?.cover_image_url} />
        <AdminInput label="Private eBook file path" name="ebook_file_path" defaultValue={book?.ebook_file_path} />
        <AdminInput label="Fallback eBook file URL" name="ebook_file_url" defaultValue={book?.ebook_file_url} />
        <AdminInput label="Sample file URL" name="sample_file_url" defaultValue={book?.sample_file_url} />
        <label className="grid gap-2 text-sm font-semibold text-neutral-800">
          Status
          <select
            name="status"
            defaultValue={book?.status || "draft"}
            className="min-h-12 rounded-md border border-neutral-300 px-4"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>
      <AdminTextarea label="Short description" name="short_description" defaultValue={book?.short_description} />
      <AdminTextarea label="Description" name="description" defaultValue={book?.description} />
      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <input type="checkbox" name="is_featured" defaultChecked={Boolean(book?.is_featured)} />
          Mark featured
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <input type="checkbox" name="is_physical_available" defaultChecked={Boolean(book?.is_physical_available)} />
          Physical available
        </label>
      </div>
      <button className="w-fit rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800">
        {book ? "Save Book" : "Create Book"}
      </button>
    </form>
  );
}

function AdminInput(props: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {props.label}
      <input
        name={props.name}
        type={props.type || "text"}
        defaultValue={props.defaultValue || ""}
        required={props.required}
        className="min-h-12 rounded-md border border-neutral-300 px-4"
      />
    </label>
  );
}

function AdminTextarea(props: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {props.label}
      <textarea
        name={props.name}
        rows={4}
        defaultValue={props.defaultValue || ""}
        className="rounded-md border border-neutral-300 px-4 py-3"
      />
    </label>
  );
}
