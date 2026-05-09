import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

type AuthorPayload = Record<string, unknown>;

export async function saveAdminAuthor(payload: AuthorPayload, id?: string) {
  await requireAdmin();
  validateAuthorPayload(payload);

  const supabase = createAdminClient();
  const authorData = {
    name: text(payload.name),
    slug: text(payload.slug),
    bio: text(payload.bio) || null,
    email: text(payload.email) || null,
    image_url: text(payload.image_url) || null,
    role_title: text(payload.role_title) || null,
    ministry_name: text(payload.ministry_name) || null,
    website_url: text(payload.website_url) || null,
    facebook_url: text(payload.facebook_url) || null,
    instagram_url: text(payload.instagram_url) || null,
    x_url: text(payload.x_url) || null,
    linkedin_url: text(payload.linkedin_url) || null,
    status: text(payload.status) === "hidden" ? "hidden" : "active",
  };

  const result = id
    ? await supabase.from("authors").update(authorData).eq("id", id).select("id").single()
    : await supabase.from("authors").insert(authorData).select("id").single();

  if (result.error) {
    if (isAuthorSlugDuplicateError(result.error)) {
      throw new Error("That author slug is already in use. Choose a unique slug and try again.");
    }

    throw new Error(result.error.message);
  }

  revalidateAuthorPaths();

  return result.data as { id: string };
}

export async function hideAdminAuthor(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("authors")
    .update({ status: "hidden" })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Unable to hide author.");
  }

  revalidateAuthorPaths();

  return data as { id: string };
}

export async function hardDeleteAdminAuthor(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("id")
    .eq("author_id", id)
    .limit(1);

  if (booksError) {
    throw new Error("Unable to check books before deleting this author.");
  }

  if (books?.length) {
    throw new Error("This author has books. Hide the author instead of permanently deleting them.");
  }

  const { error } = await supabase.from("authors").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateAuthorPaths();

  return { id };
}

function validateAuthorPayload(payload: AuthorPayload) {
  if (!text(payload.name)) {
    throw new Error("Name is required.");
  }

  if (!text(payload.slug)) {
    throw new Error("Slug is required.");
  }

  const status = text(payload.status);
  if (status && status !== "active" && status !== "hidden") {
    throw new Error("Status must be active or hidden.");
  }
}

function revalidateAuthorPaths() {
  revalidatePath("/admin/authors");
  revalidatePath("/authors");
  revalidatePath("/sitemap.xml");
}

function text(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

export function isAuthorSlugDuplicateError(error: { code?: string; message?: string }) {
  const message = error.message || "";

  return (
    error.code === "23505" &&
    message.includes("authors") &&
    (message.includes("slug") || message.includes("authors_slug"))
  );
}
