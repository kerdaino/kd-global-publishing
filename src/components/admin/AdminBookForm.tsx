"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type AdminAuthorOption = {
  id: string;
  name: string;
};

export type AdminBookFormValue = {
  id?: string;
  title?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  author_id?: string | null;
  category?: string | null;
  short_description?: string | null;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  cover_image_url?: string | null;
  ebook_file_url?: string | null;
  ebook_file_path?: string | null;
  sample_file_url?: string | null;
  format?: string | null;
  status?: string | null;
  is_featured?: boolean | null;
  is_physical_available?: boolean | null;
};

type FormState = "idle" | "submitting" | "success" | "error";

export function AdminBookForm({
  authors,
  book,
  mode,
}: {
  authors: AdminAuthorOption[];
  book?: AdminBookFormValue;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState(book?.title || "");
  const [slug, setSlug] = useState(book?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(book?.slug));
  const [authorMode, setAuthorMode] = useState<"existing" | "new">("existing");

  const endpoint = useMemo(
    () => (mode === "create" ? "/api/admin/books" : `/api/admin/books/${book?.id}`),
    [book?.id, mode],
  );

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);

    if (!payload.title || !payload.slug || !payload.price) {
      setState("error");
      setMessage("Title, slug, and price are required.");
      return;
    }

    const response = await fetch(endpoint, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!result.ok) {
      setState("error");
      setMessage(result.error || "Unable to save book.");
      return;
    }

    setState("success");
    setMessage(mode === "create" ? "Book created." : "Book updated.");
    router.push("/admin/books");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Title"
          name="title"
          value={title}
          onChange={handleTitleChange}
          required
        />
        <Field
          label="Slug"
          name="slug"
          value={slug}
          onChange={(value) => {
            setSlugTouched(true);
            setSlug(slugify(value));
          }}
          required
        />
        <Field label="Subtitle" name="subtitle" defaultValue={book?.subtitle} />
        <label className="grid gap-2 text-sm font-semibold text-neutral-800">
          Author
          <select
            name="author_id"
            defaultValue={book?.author_id || ""}
            disabled={authorMode === "new"}
            className="min-h-12 rounded-md border border-neutral-300 px-4 disabled:bg-neutral-100"
          >
            <option value="">No author selected</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <input
            type="checkbox"
            checked={authorMode === "new"}
            onChange={(event) =>
              setAuthorMode(event.currentTarget.checked ? "new" : "existing")
            }
          />
          Create a new author quickly
        </label>
        {authorMode === "new" ? (
          <>
            <Field label="New author name" name="new_author_name" />
            <Field label="New author email" name="new_author_email" type="email" />
          </>
        ) : null}
        <Field label="Category" name="category" defaultValue={book?.category} />
        <Field
          label="Price"
          name="price"
          type="number"
          defaultValue={book?.price ?? 0}
          required
        />
        <Field label="Currency" name="currency" defaultValue={book?.currency || "NGN"} />
        <Field label="Cover image URL" name="cover_image_url" defaultValue={book?.cover_image_url} />
        <Field label="Private eBook file path" name="ebook_file_path" defaultValue={book?.ebook_file_path} />
        <Field label="Fallback eBook file URL" name="ebook_file_url" defaultValue={book?.ebook_file_url} />
        <Field label="Sample file URL" name="sample_file_url" defaultValue={book?.sample_file_url} />
        <Field label="Format" name="format" defaultValue={book?.format || "PDF eBook"} />
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

      <Textarea
        label="Short description"
        name="short_description"
        defaultValue={book?.short_description}
      />
      <Textarea
        label="Full description"
        name="description"
        defaultValue={book?.description}
        rows={8}
      />

      <div className="mt-5 flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={Boolean(book?.is_featured)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <input
            type="checkbox"
            name="is_physical_available"
            defaultChecked={Boolean(book?.is_physical_available)}
          />
          Physical available
        </label>
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-wait disabled:bg-neutral-400"
      >
        {state === "submitting"
          ? "Saving..."
          : mode === "create"
            ? "Create Book"
            : "Save Book"}
      </button>
      {message ? (
        <p
          className={
            state === "success"
              ? "mt-4 rounded-md bg-neutral-950 p-4 text-sm font-semibold text-white"
              : "mt-4 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        defaultValue={value === undefined ? defaultValue || "" : undefined}
        onChange={onChange ? (event) => onChange(event.currentTarget.value) : undefined}
        required={required}
        className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <label className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue || ""}
        className="rounded-md border border-neutral-300 px-4 py-3 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
      />
    </label>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
