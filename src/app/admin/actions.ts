"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminRowByEmail, linkAdminUserId, requireAdmin } from "@/lib/admin";
import { createAdminClient, createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
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
