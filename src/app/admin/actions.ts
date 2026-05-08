"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminRowByEmail, linkAdminUserId, requireAdmin } from "@/lib/admin";
import { createAdminClient, createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function nullableText(formData: FormData, key: string) {
  return text(formData, key) || null;
}

function textArray(formData: FormData, key: string) {
  return text(formData, key)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function nullableStoragePath(formData: FormData, key: string, bucket = "ebook-files") {
  return text(formData, key).replace(new RegExp(`^${bucket}/`), "").replace(/^\/+/, "") || null;
}

function money(formData: FormData, key: string) {
  const value = Number(formData.get(key) || 0);
  return Number.isFinite(value) ? value : 0;
}

export async function loginAdmin(formData: FormData) {
  const email = text(formData, "email");
  const password = text(formData, "password");

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/admin/login?error=Invalid%20login%20details");
  }

  const adminUser = data.user.email
    ? await getAdminRowByEmail(data.user.email)
    : null;

  if (!adminUser) {
    redirect("/admin/unauthorized");
  }

  await linkAdminUserId(adminUser, data.user.id);

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createBook(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.from("books").insert({
    title: text(formData, "title"),
    slug: text(formData, "slug"),
    subtitle: nullableText(formData, "subtitle"),
    author_id: nullableText(formData, "author_id"),
    category: nullableText(formData, "category"),
    description: nullableText(formData, "description"),
    short_description: nullableText(formData, "short_description"),
    price: money(formData, "price"),
    currency: text(formData, "currency") || "NGN",
    cover_image_url: nullableText(formData, "cover_image_url"),
    ebook_file_url: nullableText(formData, "ebook_file_url"),
    ebook_file_path: nullableStoragePath(formData, "ebook_file_path"),
    sample_file_url: nullableText(formData, "sample_file_url"),
    sample_file_path: nullableStoragePath(formData, "sample_file_path", "sample-files"),
    payment_link: nullableText(formData, "payment_link"),
    what_readers_will_learn: textArray(formData, "what_readers_will_learn"),
    format: text(formData, "format") || "PDF eBook",
    status: text(formData, "status") || "draft",
    is_featured: formData.get("is_featured") === "on",
    is_physical_available: formData.get("is_physical_available") === "on",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/books");
  revalidatePath("/bookstore");
}

export async function updateBook(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("books")
    .update({
      title: text(formData, "title"),
      slug: text(formData, "slug"),
      subtitle: nullableText(formData, "subtitle"),
      author_id: nullableText(formData, "author_id"),
      category: nullableText(formData, "category"),
      description: nullableText(formData, "description"),
      short_description: nullableText(formData, "short_description"),
      price: money(formData, "price"),
      currency: text(formData, "currency") || "NGN",
      cover_image_url: nullableText(formData, "cover_image_url"),
      ebook_file_url: nullableText(formData, "ebook_file_url"),
      ebook_file_path: nullableStoragePath(formData, "ebook_file_path"),
      sample_file_url: nullableText(formData, "sample_file_url"),
      sample_file_path: nullableStoragePath(formData, "sample_file_path", "sample-files"),
      payment_link: nullableText(formData, "payment_link"),
      what_readers_will_learn: textArray(formData, "what_readers_will_learn"),
      format: text(formData, "format") || "PDF eBook",
      status: text(formData, "status") || "draft",
      is_featured: formData.get("is_featured") === "on",
      is_physical_available: formData.get("is_physical_available") === "on",
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/books");
  revalidatePath("/bookstore");
}

export async function updateOrderDeliveryStatus(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ delivery_status: text(formData, "delivery_status") })
    .eq("id", text(formData, "id"));

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/orders");
}

export async function updatePublishingInquiryStatus(formData: FormData) {
  await updateStatus("publishing_inquiries", "/admin/inquiries", formData);
}

export async function updateSermonProjectStatus(formData: FormData) {
  await updateStatus("sermon_book_projects", "/admin/sermon-projects", formData);
}

export async function updatePrintRequestStatus(formData: FormData) {
  await updateStatus("print_requests", "/admin/print-requests", formData);
}

async function updateStatus(table: string, path: string, formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from(table)
    .update({ status: text(formData, "status") })
    .eq("id", text(formData, "id"));

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(path);
}
