import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

type BookPayload = Record<string, unknown>;

export async function saveAdminBook(payload: BookPayload, id?: string) {
  await requireAdmin();
  validateBookPayload(payload);

  const supabase = createAdminClient();
  let authorId = text(payload.author_id) || null;

  if (text(payload.new_author_name)) {
    const { data: author, error: authorError } = await supabase
      .from("authors")
      .insert({
        name: text(payload.new_author_name),
        slug: slugify(text(payload.new_author_name)),
        email: text(payload.new_author_email) || null,
      })
      .select("id")
      .single();

    if (authorError || !author) {
      throw new Error(authorError?.message || "Unable to create author.");
    }

    authorId = (author as { id: string }).id;
  }

  const bookData = {
    title: text(payload.title),
    slug: text(payload.slug),
    subtitle: text(payload.subtitle) || null,
    author_id: authorId,
    category: text(payload.category) || null,
    short_description: text(payload.short_description) || null,
    description: text(payload.description) || null,
    price: Number(payload.price),
    currency: text(payload.currency) || "NGN",
    cover_image_url: text(payload.cover_image_url) || null,
    ebook_file_url: text(payload.ebook_file_url) || null,
    ebook_file_path: normalizeStoragePath(text(payload.ebook_file_path)) || null,
    sample_file_url: text(payload.sample_file_url) || null,
    sample_file_path: normalizeStoragePath(text(payload.sample_file_path), "sample-files") || null,
    payment_link: text(payload.payment_link) || null,
    what_readers_will_learn: lines(payload.what_readers_will_learn),
    format: text(payload.format) || "PDF eBook",
    status: text(payload.status) || "draft",
    is_featured: booleanValue(payload.is_featured),
    is_physical_available: booleanValue(payload.is_physical_available),
  };

  const result = id
    ? await supabase.from("books").update(bookData).eq("id", id).select("id").single()
    : await supabase.from("books").insert(bookData).select("id").single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  revalidateBookPaths();

  return result.data as { id: string };
}

export async function archiveAdminBook(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("books")
    .update({ status: "archived" })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Unable to archive book.");
  }

  revalidateBookPaths();

  return data as { id: string };
}

export async function hardDeleteAdminBook(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: paidOrders, error: paidOrdersError } = await supabase
    .from("orders")
    .select("id")
    .eq("book_id", id)
    .eq("payment_status", "paid")
    .limit(1);

  if (paidOrdersError) {
    throw new Error("Unable to check paid orders before deleting this book.");
  }

  if (paidOrders?.length) {
    throw new Error("This book has paid orders. Archive it instead of permanently deleting it.");
  }

  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateBookPaths();

  return { id };
}

function validateBookPayload(payload: BookPayload) {
  if (!text(payload.title)) {
    throw new Error("Title is required.");
  }

  if (!text(payload.slug)) {
    throw new Error("Slug is required.");
  }

  if (!Number.isFinite(Number(payload.price)) || Number(payload.price) < 0) {
    throw new Error("Valid price is required.");
  }
}

function revalidateBookPaths() {
  revalidatePath("/admin/books");
  revalidatePath("/bookstore");
}

function text(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

function lines(input: unknown) {
  if (Array.isArray(input)) {
    return input.map((item) => text(item)).filter(Boolean);
  }

  return text(input)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function booleanValue(input: unknown) {
  return input === true || input === "true" || input === "on";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeStoragePath(value: string, bucket = "ebook-files") {
  if (!value) {
    return "";
  }

  return value.replace(new RegExp(`^${bucket}/`), "").replace(/^\/+/, "");
}
