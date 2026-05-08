"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
  sample_file_path?: string | null;
  payment_link?: string | null;
  what_readers_will_learn?: string[] | null;
  format?: string | null;
  status?: string | null;
  is_featured?: boolean | null;
  is_physical_available?: boolean | null;
};

type FormState = "idle" | "submitting" | "success" | "error";
type UploadKey = "cover" | "ebook" | "sample";
type UploadState = "idle" | "selected" | "uploading" | "uploaded" | "error";

const uploadConfig = {
  cover: {
    bucket: "book-covers",
    inputName: "cover_file",
    label: "Cover image",
    accept: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp",
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: ["jpg", "jpeg", "png", "webp"],
    hiddenUrlName: "cover_image_url",
    kind: "cover",
  },
  ebook: {
    bucket: "ebook-files",
    inputName: "ebook_file",
    label: "eBook file",
    accept: ".pdf,.epub,application/pdf,application/epub+zip",
    allowedTypes: ["application/pdf", "application/epub+zip"],
    allowedExtensions: ["pdf", "epub"],
    hiddenPathName: "ebook_file_path",
    kind: "ebook",
  },
  sample: {
    bucket: "sample-files",
    inputName: "sample_file",
    label: "Sample file",
    accept: ".pdf,application/pdf",
    allowedTypes: ["application/pdf"],
    allowedExtensions: ["pdf"],
    hiddenUrlName: "sample_file_url",
    hiddenPathName: "sample_file_path",
    kind: "sample",
  },
} as const;

const bookCategories = [
  "Christian Living",
  "Devotional",
  "Sermon Book",
  "Bible Study",
  "Discipleship",
  "Prayer",
  "Ministry Resource",
  "Other",
] as const;

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
  const [assetValues, setAssetValues] = useState({
    cover_image_url: book?.cover_image_url || "",
    ebook_file_path: book?.ebook_file_path || "",
    sample_file_url: book?.sample_file_url || "",
    sample_file_path: book?.sample_file_path || "",
  });
  const [uploadStates, setUploadStates] = useState<Record<UploadKey, UploadState>>({
    cover: "idle",
    ebook: "idle",
    sample: "idle",
  });
  const isUploading = Object.values(uploadStates).some((uploadState) => uploadState === "uploading");

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

    const formData = new FormData(event.currentTarget);

    if (!formData.get("title") || !formData.get("slug") || !formData.get("price")) {
      setState("error");
      setMessage("Title, slug, and price are required.");
      return;
    }

    try {
      await uploadSelectedFiles(formData);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to upload files.");
      return;
    }

    const response = await fetch(endpoint, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
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

  async function uploadSelectedFiles(formData: FormData) {
    const supabase = createClient();
    const nextAssetValues = { ...assetValues };

    for (const key of ["cover", "ebook", "sample"] as UploadKey[]) {
      const config = uploadConfig[key];
      const file = formData.get(config.inputName);

      if (!(file instanceof File) || file.size === 0) {
        formData.delete(config.inputName);
        continue;
      }

      validateFile(key, file);
      setUploadStates((current) => ({ ...current, [key]: "uploading" }));

      const path = buildStoragePath(slug || String(formData.get("slug") || ""), config.kind, file);
      const { error } = await supabase.storage.from(config.bucket).upload(path, file, {
        cacheControl: "3600",
        contentType: file.type || undefined,
        upsert: false,
      });

      if (error) {
        setUploadStates((current) => ({ ...current, [key]: "error" }));
        throw new Error(`${config.label} upload failed: ${error.message}`);
      }

      if ("hiddenUrlName" in config) {
        const { data } = supabase.storage.from(config.bucket).getPublicUrl(path);
        formData.set(config.hiddenUrlName, data.publicUrl);
        nextAssetValues[config.hiddenUrlName] = data.publicUrl;

        if (config.hiddenUrlName === "cover_image_url") {
          console.log("Uploaded cover_image_url:", data.publicUrl);
        }
      }

      if ("hiddenPathName" in config) {
        formData.set(config.hiddenPathName, path);
        nextAssetValues[config.hiddenPathName] = path;
      }

      formData.delete(config.inputName);
      setUploadStates((current) => ({ ...current, [key]: "uploaded" }));
    }

    setAssetValues(nextAssetValues);
  }

  function handleFileChange(key: UploadKey, file: File | null) {
    if (!file) {
      setUploadStates((current) => ({ ...current, [key]: "idle" }));
      return;
    }

    try {
      validateFile(key, file);
      setUploadStates((current) => ({ ...current, [key]: "selected" }));
      setMessage("");
      if (state === "error") {
        setState("idle");
      }
    } catch (error) {
      setUploadStates((current) => ({ ...current, [key]: "error" }));
      setState("error");
      setMessage(error instanceof Error ? error.message : "Invalid file selected.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" value={title} onChange={handleTitleChange} required />
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
        <label className="grid gap-2 text-sm font-semibold text-neutral-800">
          Category
          <select
            name="category"
            defaultValue={book?.category || "Christian Living"}
            className="min-h-12 rounded-md border border-neutral-300 px-4"
          >
            {bookCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Price"
          name="price"
          type="number"
          defaultValue={book?.price ?? 0}
          required
        />
        <Field label="Currency" name="currency" defaultValue={book?.currency || "NGN"} />
        <UploadField
          configKey="cover"
          currentValue={assetValues.cover_image_url}
          state={uploadStates.cover}
          onFileChange={handleFileChange}
        />
        <UploadField
          configKey="ebook"
          currentValue={assetValues.ebook_file_path}
          state={uploadStates.ebook}
          onFileChange={handleFileChange}
        />
        <UploadField
          configKey="sample"
          currentValue={assetValues.sample_file_url}
          state={uploadStates.sample}
          onFileChange={handleFileChange}
        />
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

      <input type="hidden" name="cover_image_url" value={assetValues.cover_image_url} />
      <input type="hidden" name="ebook_file_path" value={assetValues.ebook_file_path} />
      <input type="hidden" name="sample_file_url" value={assetValues.sample_file_url} />
      <input type="hidden" name="sample_file_path" value={assetValues.sample_file_path} />

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
      <Textarea
        label="What readers will learn"
        name="what_readers_will_learn"
        defaultValue={linesToTextareaValue(book?.what_readers_will_learn)}
        rows={4}
      />

      <details className="mt-5 rounded-md border border-neutral-200 bg-neutral-50 p-4">
        <summary className="cursor-pointer text-sm font-bold text-neutral-900">
          Advanced
        </summary>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field
            label="Fallback eBook file URL"
            name="ebook_file_url"
            defaultValue={book?.ebook_file_url}
          />
          <Field label="Payment link" name="payment_link" defaultValue={book?.payment_link} />
        </div>
      </details>

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
        {isUploading
          ? "Uploading files..."
          : state === "submitting"
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

function UploadField({
  configKey,
  currentValue,
  state,
  onFileChange,
}: {
  configKey: UploadKey;
  currentValue: string;
  state: UploadState;
  onFileChange: (key: UploadKey, file: File | null) => void;
}) {
  const config = uploadConfig[configKey];
  const statusText = {
    idle: currentValue ? "Current file saved. Choose a new file to replace it." : "Optional. You can add this later.",
    selected: "Ready to upload when you save.",
    uploading: "Uploading...",
    uploaded: "Uploaded.",
    error: "Choose a valid file and try again.",
  }[state];

  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {config.label}
      <input
        name={config.inputName}
        type="file"
        accept={config.accept}
        onChange={(event) => onFileChange(configKey, event.currentTarget.files?.[0] || null)}
        className="min-h-12 rounded-md border border-neutral-300 px-4 py-3 text-base font-normal file:mr-4 file:rounded-md file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
      />
      {configKey === "cover" && currentValue ? (
        <span className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentValue} alt="Current book cover" className="h-32 w-full object-contain" />
        </span>
      ) : null}
      {currentValue && configKey !== "cover" ? (
        <span className="truncate text-xs font-normal text-neutral-600">{currentValue}</span>
      ) : null}
      <span className="text-xs font-semibold text-neutral-500">{statusText}</span>
    </label>
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

function validateFile(key: UploadKey, file: File) {
  const config = uploadConfig[key];
  const extension = getExtension(file.name);
  const allowedTypes: readonly string[] = config.allowedTypes;
  const allowedExtensions: readonly string[] = config.allowedExtensions;
  const hasAllowedType = file.type ? allowedTypes.includes(file.type) : false;
  const hasAllowedExtension = allowedExtensions.includes(extension);

  if (!hasAllowedType && !hasAllowedExtension) {
    throw new Error(`${config.label} must be ${config.allowedExtensions.join(", ")}.`);
  }
}

function buildStoragePath(slug: string, kind: string, file: File) {
  const safeSlug = slugify(slug) || "book";
  const extension = getExtension(file.name) || extensionFromType(file.type) || "file";

  return `${safeSlug}/${Date.now()}-${kind}.${extension}`;
}

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function extensionFromType(type: string) {
  const types: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
    "application/epub+zip": "epub",
  };

  return types[type];
}

function linesToTextareaValue(value: string[] | null | undefined) {
  return Array.isArray(value) ? value.join("\n") : "";
}
