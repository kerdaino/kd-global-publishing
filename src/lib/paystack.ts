import crypto from "node:crypto";
import { createDownloadTokenForOrder } from "@/lib/downloads";
import {
  adminOrderNotificationEmail,
  orderConfirmationEmail,
} from "@/lib/emails";
import {
  isResendConfigured,
  sendAdminEmail,
  sendCustomerEmail,
} from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/server";
import { getBaseUrl, requiredEnv } from "@/lib/utils";

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    paid_at?: string;
    paidAt?: string;
    customer?: {
      email?: string;
    };
    metadata?: {
      orderId?: string;
      bookId?: string;
      customerName?: string;
      customerEmail?: string;
      [key: string]: unknown;
    };
  };
};

type OrderWithBook = {
  id: string;
  book_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  amount: number;
  currency: string | null;
  paystack_reference: string;
  payment_status: string | null;
  delivery_status: string | null;
  created_at: string;
  paid_at: string | null;
  books: {
    id: string;
    title: string;
    slug: string;
    ebook_file_url: string | null;
    ebook_file_path: string | null;
  } | null;
};

export function getPaystackSecretKey() {
  return requiredEnv("PAYSTACK_SECRET_KEY");
}

export function createPaymentReference() {
  return `kdgph_${crypto.randomUUID().replaceAll("-", "")}`;
}

export function nairaToKobo(amount: number) {
  return Math.round(Number(amount) * 100);
}

export async function initializePaystackTransaction({
  amount,
  email,
  reference,
  callbackUrl,
  metadata,
}: {
  amount: number;
  email: string;
  reference: string;
  callbackUrl?: string;
  metadata: Record<string, string>;
}) {
  const callback_url =
    callbackUrl || `${getBaseUrl()}/checkout/success`;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      email,
      currency: "NGN",
      callback_url,
      reference,
      metadata,
    }),
  });

  return (await response.json()) as PaystackInitializeResponse;
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getPaystackSecretKey()}`,
      },
    },
  );

  return (await response.json()) as PaystackVerifyResponse;
}

export function verifyPaystackWebhookSignature(body: string, signature: string) {
  const hash = crypto
    .createHmac("sha512", getPaystackSecretKey())
    .update(body)
    .digest("hex");

  return hash === signature;
}

export async function fulfillPaidOrder({
  reference,
  paystackAmount,
  paidAt,
}: {
  reference: string;
  paystackAmount: number;
  paidAt?: string;
}) {
  const supabase = createAdminClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, books(id, title, slug, ebook_file_url, ebook_file_path)")
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (orderError || !order) {
    throw new Error("Order not found for this Paystack reference.");
  }

  const typedOrder = order as OrderWithBook;
  const expectedAmount = nairaToKobo(Number(typedOrder.amount));

  if (expectedAmount !== Number(paystackAmount)) {
    throw new Error("Verified amount does not match order amount.");
  }

  if (typedOrder.payment_status !== "paid") {
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        paid_at: paidAt || new Date().toISOString(),
      })
      .eq("id", typedOrder.id);

    if (updateError) {
      throw new Error("Unable to update paid order.");
    }
  }

  const downloadToken = await createDownloadTokenForOrder(typedOrder.id);

  const downloadUrl = `${getBaseUrl()}/download/${downloadToken.token}`;
  const shouldSendEmail = typedOrder.delivery_status !== "download_sent";
  let emailSent = false;

  if (shouldSendEmail && isResendConfigured()) {
    const customerEmail = orderConfirmationEmail({
      customerName: typedOrder.customer_name,
      bookTitle: typedOrder.books?.title || "your book",
      downloadLink: downloadUrl,
    });

    const adminEmail = adminOrderNotificationEmail({
      bookTitle: typedOrder.books?.title || String(typedOrder.book_id || "Book"),
      customerName: typedOrder.customer_name,
      customerEmail: typedOrder.customer_email,
      amount: typedOrder.amount,
      paystackReference: typedOrder.paystack_reference,
    });

    const customerEmailResult = await sendCustomerEmail({
      to: typedOrder.customer_email,
      ...customerEmail,
    });

    const adminEmailResult = await sendAdminEmail(adminEmail);

    if (!customerEmailResult.ok) {
      console.error("Customer order email was not sent", customerEmailResult.error);
    }

    if (!adminEmailResult.ok) {
      console.error("Admin order email was not sent", adminEmailResult.error);
    }

    emailSent = Boolean(customerEmailResult.ok);

    if (emailSent) {
      await supabase
        .from("orders")
        .update({ delivery_status: "download_sent" })
        .eq("id", typedOrder.id);
    }
  }

  return {
    orderId: typedOrder.id,
    reference: typedOrder.paystack_reference,
    customerName: typedOrder.customer_name,
    customerEmail: typedOrder.customer_email,
    bookTitle: typedOrder.books?.title || "Book",
    amount: typedOrder.amount,
    currency: typedOrder.currency || "NGN",
    downloadUrl,
    emailSent,
  };
}
