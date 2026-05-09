"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
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

const coverImageRules = {
  maxSize: 5 * 1024 * 1024,
  minWidth: 1000,
  minHeight: 1600,
  targetRatio: 5 / 8,
  ratioTolerance: 0.01,
};

const ebookFileRules = {
  maxSize: 50 * 1024 * 1024,
};

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
  const formId = useId();
  const messageId = `${formId}-form-message`;
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

      await validateFile(key, file);
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

  async function handleFileChange(key: UploadKey, file: File | null) {
    if (!file) {
      setUploadStates((current) => ({ ...current, [key]: "idle" }));
      return;
    }

    try {
      await validateFile(key, file);
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
      aria-describedby={message ? messageId : undefined}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={`${formId}-title`} label="Title" name="title" value={title} onChange={handleTitleChange} required />
        <Field
          id={`${formId}-slug`}
          label="Slug"
          name="slug"
          value={slug}
          onChange={(value) => {
            setSlugTouched(true);
            setSlug(slugify(value));
          }}
          required
        />
        <Field id={`${formId}-subtitle`} label="Subtitle" name="subtitle" defaultValue={book?.subtitle} />
        <label htmlFor={`${formId}-author`} className="grid gap-2 text-sm font-semibold text-neutral-800">
          Author
          <select
            id={`${formId}-author`}
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
        <label htmlFor={`${formId}-create-author`} className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <input
            id={`${formId}-create-author`}
            aria-describedby={`${formId}-new-author-description`}
            type="checkbox"
            checked={authorMode === "new"}
            onChange={(event) =>
              setAuthorMode(event.currentTarget.checked ? "new" : "existing")
            }
          />
          Create a new author quickly
          <span id={`${formId}-new-author-description`} className="sr-only">
            Disables the author selector and shows fields for a new author.
          </span>
        </label>
        {authorMode === "new" ? (
          <>
            <Field id={`${formId}-new-author-name`} label="New author name" name="new_author_name" />
            <Field id={`${formId}-new-author-email`} label="New author email" name="new_author_email" type="email" />
          </>
        ) : null}
        <label htmlFor={`${formId}-category`} className="grid gap-2 text-sm font-semibold text-neutral-800">
          Category
          <select
            id={`${formId}-category`}
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
          id={`${formId}-price`}
          label="Price"
          name="price"
          type="number"
          defaultValue={book?.price ?? 0}
          required
        />
        <Field id={`${formId}-currency`} label="Currency" name="currency" defaultValue={book?.currency || "NGN"} />
        <UploadField
          id={`${formId}-cover-file`}
          configKey="cover"
          currentValue={assetValues.cover_image_url}
          state={uploadStates.cover}
          onFileChange={handleFileChange}
        />
        <UploadField
          id={`${formId}-ebook-file`}
          configKey="ebook"
          currentValue={assetValues.ebook_file_path}
          state={uploadStates.ebook}
          onFileChange={handleFileChange}
        />
        <UploadField
          id={`${formId}-sample-file`}
          configKey="sample"
          currentValue={assetValues.sample_file_url}
          state={uploadStates.sample}
          onFileChange={handleFileChange}
        />
        <Field id={`${formId}-format`} label="Format" name="format" defaultValue={book?.format || "PDF eBook"} />
        <label htmlFor={`${formId}-status`} className="grid gap-2 text-sm font-semibold text-neutral-800">
          Status
          <select
            id={`${formId}-status`}
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
        id={`${formId}-short-description`}
        label="Short description"
        name="short_description"
        defaultValue={book?.short_description}
      />
      <Textarea
        id={`${formId}-description`}
        label="Full description"
        name="description"
        defaultValue={book?.description}
        rows={8}
      />
      <Textarea
        id={`${formId}-what-readers-will-learn`}
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
            id={`${formId}-ebook-file-url`}
            label="Fallback eBook file URL"
            name="ebook_file_url"
            defaultValue={book?.ebook_file_url}
          />
          <Field id={`${formId}-payment-link`} label="Payment link" name="payment_link" defaultValue={book?.payment_link} />
        </div>
      </details>

      <div className="mt-5 flex flex-wrap gap-5">
        <label htmlFor={`${formId}-is-featured`} className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <input
            id={`${formId}-is-featured`}
            type="checkbox"
            name="is_featured"
            defaultChecked={Boolean(book?.is_featured)}
          />
          Featured
        </label>
        <label htmlFor={`${formId}-is-physical-available`} className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <input
            id={`${formId}-is-physical-available`}
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
          id={messageId}
          role={state === "error" ? "alert" : "status"}
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
  id,
  configKey,
  currentValue,
  state,
  onFileChange,
}: {
  id: string;
  configKey: UploadKey;
  currentValue: string;
  state: UploadState;
  onFileChange: (key: UploadKey, file: File | null) => void | Promise<void>;
}) {
  const config = uploadConfig[configKey];
  const statusText = {
    idle: currentValue ? "Current file saved. Choose a new file to replace it." : "No file selected.",
    selected: "Ready to upload when you save.",
    uploading: "Uploading...",
    uploaded: "Uploaded.",
    error: "Choose a valid file and try again.",
  }[state];

  return (
    <label
      htmlFor={id}
      className="grid min-w-0 gap-2 text-sm font-semibold text-neutral-800"
    >
      {config.label}
      <input
        id={id}
        name={config.inputName}
        type="file"
        accept={config.accept}
        onChange={(event) => onFileChange(configKey, event.currentTarget.files?.[0] || null)}
        className="min-h-12 w-full min-w-0 rounded-md border border-neutral-300 px-4 py-3 text-base font-normal file:mr-4 file:rounded-md file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
      />
      {configKey === "cover" ? (
        <span className="text-xs font-semibold text-neutral-500">
          Recommended cover size: 1600 × 2560px, JPG/PNG/WebP, max 5MB.
        </span>
      ) : null}
      {configKey === "ebook" ? (
        <span className="text-xs font-semibold text-neutral-500">
          Upload final eBook file in PDF or EPUB format. Max size: 50MB.
        </span>
      ) : null}
      {configKey === "cover" && currentValue ? (
        <span className="aspect-[5/8] w-28 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentValue}
            alt="Current book cover"
            className="block h-full w-full object-cover"
          />
        </span>
      ) : null}
      {currentValue && configKey !== "cover" ? (
        <span className="truncate text-xs font-normal text-neutral-600">
          Current {config.label}: {currentValue}
        </span>
      ) : null}
      <span className="text-xs font-semibold text-neutral-500">{statusText}</span>
    </label>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  defaultValue,
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <input
        id={id}
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
  id,
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  id: string;
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <label htmlFor={id} className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <textarea
        id={id}
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

async function validateFile(key: UploadKey, file: File) {
  const config = uploadConfig[key];
  const extension = getExtension(file.name);
  const allowedTypes: readonly string[] = config.allowedTypes;
  const allowedExtensions: readonly string[] = config.allowedExtensions;
  const hasAllowedType = file.type ? allowedTypes.includes(file.type) : false;
  const hasAllowedExtension = allowedExtensions.includes(extension);

  if (!hasAllowedType && !hasAllowedExtension) {
    throw new Error(`${config.label} must be ${config.allowedExtensions.join(", ")}.`);
  }

  if (key === "ebook" && file.size > ebookFileRules.maxSize) {
    throw new Error("eBook file must be 50MB or less.");
  }

  if (key !== "cover") {
    return;
  }

  if (file.size > coverImageRules.maxSize) {
    throw new Error("Cover image must be 5MB or less.");
  }

  const { width, height } = await getImageDimensions(file);

  if (width < coverImageRules.minWidth || height < coverImageRules.minHeight) {
    throw new Error(
      "Cover image is too small. Please upload at least 1000px wide by 1600px tall.",
    );
  }

  const ratio = width / height;

  if (Math.abs(ratio - coverImageRules.targetRatio) > coverImageRules.ratioTolerance) {
    throw new Error("Cover image must be portrait format, ideally 1600px by 2560px.");
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

function getImageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Cover image must be a readable JPG, PNG, or WebP file."));
    };

    image.src = objectUrl;
  });
}

function linesToTextareaValue(value: string[] | null | undefined) {
  return Array.isArray(value) ? value.join("\n") : "";
}
