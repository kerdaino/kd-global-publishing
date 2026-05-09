"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type AdminAuthorFormValue = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  bio?: string | null;
  email?: string | null;
  image_url?: string | null;
  role_title?: string | null;
  ministry_name?: string | null;
  website_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  x_url?: string | null;
  linkedin_url?: string | null;
  status?: string | null;
};

type FormState = "idle" | "submitting" | "success" | "error";
type UploadState = "idle" | "selected" | "uploading" | "uploaded" | "error";

const imageRules = {
  maxSize: 3 * 1024 * 1024,
  minWidth: 600,
  minHeight: 600,
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  allowedExtensions: ["jpg", "jpeg", "png", "webp"],
};

export function AdminAuthorForm({
  author,
  mode,
}: {
  author?: AdminAuthorFormValue;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const formId = useId();
  const messageId = `${formId}-form-message`;
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [name, setName] = useState(author?.name || "");
  const [slug, setSlug] = useState(author?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(author?.slug));
  const [imageUrl, setImageUrl] = useState(author?.image_url || "");
  const [uploadState, setUploadState] = useState<UploadState>("idle");

  const endpoint = useMemo(
    () => (mode === "create" ? "/api/admin/authors" : `/api/admin/authors/${author?.id}`),
    [author?.id, mode],
  );

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    if (!formData.get("name") || !formData.get("slug")) {
      setState("error");
      setMessage("Name and slug are required.");
      return;
    }

    try {
      await uploadSelectedImage(formData);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to upload author image.");
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
      setMessage(result.error || "Unable to save author.");
      return;
    }

    setState("success");
    setMessage(mode === "create" ? "Author created." : "Author updated.");
    router.push("/admin/authors");
    router.refresh();
  }

  async function uploadSelectedImage(formData: FormData) {
    const file = formData.get("image_file");

    if (!(file instanceof File) || file.size === 0) {
      formData.delete("image_file");
      return;
    }

    await validateImage(file);
    setUploadState("uploading");

    const supabase = createClient();
    const path = buildStoragePath(slug || String(formData.get("slug") || ""), file);
    const { error } = await supabase.storage.from("author-images").upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: false,
    });

    if (error) {
      setUploadState("error");
      throw new Error(`Author image upload failed: ${error.message}`);
    }

    const { data } = supabase.storage.from("author-images").getPublicUrl(path);
    formData.set("image_url", data.publicUrl);
    formData.delete("image_file");
    setImageUrl(data.publicUrl);
    setUploadState("uploaded");
  }

  async function handleFileChange(file: File | null) {
    if (!file) {
      setUploadState("idle");
      return;
    }

    try {
      await validateImage(file);
      setUploadState("selected");
      setMessage("");
      if (state === "error") {
        setState("idle");
      }
    } catch (error) {
      setUploadState("error");
      setState("error");
      setMessage(error instanceof Error ? error.message : "Invalid image selected.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby={message ? messageId : undefined}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={`${formId}-name`} label="Name" name="name" value={name} onChange={handleNameChange} required />
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
        <Field id={`${formId}-email`} label="Email" name="email" type="email" defaultValue={author?.email} />
        <Field id={`${formId}-role-title`} label="Role / title" name="role_title" defaultValue={author?.role_title} />
        <Field id={`${formId}-ministry-name`} label="Ministry name" name="ministry_name" defaultValue={author?.ministry_name} />
        <Field id={`${formId}-website-url`} label="Website URL" name="website_url" type="url" defaultValue={author?.website_url} />
        <label htmlFor={`${formId}-status`} className="grid gap-2 text-sm font-semibold text-neutral-800">
          Status
          <select
            id={`${formId}-status`}
            name="status"
            defaultValue={author?.status || "active"}
            className="min-h-12 rounded-md border border-neutral-300 px-4"
          >
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        <ImageUploadField
          id={`${formId}-image-file`}
          currentValue={imageUrl}
          state={uploadState}
          onFileChange={handleFileChange}
        />
      </div>

      <input type="hidden" name="image_url" value={imageUrl} />

      <Textarea id={`${formId}-bio`} label="Bio" name="bio" defaultValue={author?.bio} rows={7} />

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field id={`${formId}-facebook-url`} label="Facebook URL" name="facebook_url" type="url" defaultValue={author?.facebook_url} />
        <Field id={`${formId}-instagram-url`} label="Instagram URL" name="instagram_url" type="url" defaultValue={author?.instagram_url} />
        <Field id={`${formId}-x-url`} label="X URL" name="x_url" type="url" defaultValue={author?.x_url} />
        <Field id={`${formId}-linkedin-url`} label="LinkedIn URL" name="linkedin_url" type="url" defaultValue={author?.linkedin_url} />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-wait disabled:bg-neutral-400"
      >
        {uploadState === "uploading"
          ? "Uploading image..."
          : state === "submitting"
            ? "Saving..."
            : mode === "create"
              ? "Create Author"
              : "Save Author"}
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

function ImageUploadField({
  id,
  currentValue,
  state,
  onFileChange,
}: {
  id: string;
  currentValue: string;
  state: UploadState;
  onFileChange: (file: File | null) => void;
}) {
  const statusText = {
    idle: currentValue ? "Current image saved. Choose a new image to replace it." : "No image selected.",
    selected: "Ready to upload when you save.",
    uploading: "Uploading...",
    uploaded: "Uploaded.",
    error: "Choose a valid image and try again.",
  }[state];

  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-semibold text-neutral-800">
      Author image
      <input
        id={id}
        name="image_file"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={(event) => onFileChange(event.currentTarget.files?.[0] || null)}
        className="min-h-12 rounded-md border border-neutral-300 px-4 py-3 text-base font-normal file:mr-4 file:rounded-md file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
      />
      <span className="text-xs font-semibold text-neutral-500">
        Square JPG, PNG, or WebP. Minimum 600 × 600px. Max size: 3MB.
      </span>
      {currentValue ? (
        <span className="aspect-square w-24 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentValue} alt="Current author" className="h-full w-full object-cover" />
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

async function validateImage(file: File) {
  const extension = getExtension(file.name);
  const hasAllowedType = file.type ? imageRules.allowedTypes.includes(file.type) : false;
  const hasAllowedExtension = imageRules.allowedExtensions.includes(extension);

  if (!hasAllowedType && !hasAllowedExtension) {
    throw new Error("Author image must be jpg, jpeg, png, or webp.");
  }

  if (file.size > imageRules.maxSize) {
    throw new Error("Author image must be 3MB or less.");
  }

  const { width, height } = await getImageDimensions(file);

  if (width < imageRules.minWidth || height < imageRules.minHeight) {
    throw new Error("Author image must be at least 600px by 600px.");
  }

  if (width !== height) {
    throw new Error("Author image must be square.");
  }
}

function buildStoragePath(slug: string, file: File) {
  const safeSlug = slugify(slug) || "author";
  const extension = getExtension(file.name) || extensionFromType(file.type) || "jpg";

  return `${safeSlug}/${Date.now()}-profile.${extension}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function extensionFromType(type: string) {
  const types: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
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
      reject(new Error("Author image must be a readable JPG, PNG, or WebP file."));
    };

    image.src = objectUrl;
  });
}
