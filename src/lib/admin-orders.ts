import { revalidatePath } from "next/cache";
import { createDownloadTokenForOrder } from "@/lib/downloads";
import { orderConfirmationEmail } from "@/lib/emails";
import { sendCustomerEmail } from "@/lib/resend";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/utils";

type AdminOrderWithBook = {
  id: string;
  customer_name: string;
  customer_email: string;
  delivery_status: string | null;
  payment_status: string | null;
  books: { title: string } | { title: string }[] | null;
};

export async function getAdminOrderDownloadLink(orderId: string) {
  await requireAdmin();
  const token = await createDownloadTokenForOrder(orderId);

  return `${getBaseUrl()}/download/${token.token}`;
}

export async function resendAdminOrderDownloadEmail(orderId: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, customer_name, customer_email, delivery_status, payment_status, books(title)")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Order not found.");
  }

  const order = data as AdminOrderWithBook;

  if (order.payment_status !== "paid") {
    throw new Error("Download email can only be resent for paid orders.");
  }

  const book = Array.isArray(order.books) ? order.books[0] : order.books;
  const downloadLink = await getAdminOrderDownloadLink(order.id);
  const email = orderConfirmationEmail({
    customerName: order.customer_name,
    bookTitle: book?.title || "your book",
    downloadLink,
  });
  const result = await sendCustomerEmail({
    to: order.customer_email,
    ...email,
  });

  if (!result.ok) {
    throw new Error("Unable to send download email right now.");
  }

  await supabase
    .from("orders")
    .update({ delivery_status: "download_sent" })
    .eq("id", order.id);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${order.id}`);

  return { downloadLink };
}

export async function markAdminOrderDelivered(orderId: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ delivery_status: "fulfilled" })
    .eq("id", orderId);

  if (error) {
    throw new Error("Unable to mark order as delivered.");
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  return { id: orderId };
}
