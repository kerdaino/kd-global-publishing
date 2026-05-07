import { createAdminClient } from "@/lib/supabase/server";
import {
  createPaymentReference,
  initializePaystackTransaction,
  nairaToKobo,
} from "@/lib/paystack";
import { jsonError, jsonOk } from "@/lib/utils";

type InitializePayload = {
  bookId?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as InitializePayload;
    const bookId = text(payload.bookId);
    const name = text(payload.name);
    const email = text(payload.email).toLowerCase();
    const phone = text(payload.phone);

    if (!bookId || !name || !email) {
      return jsonError("Book, name, and email are required.");
    }

    if (!isValidEmail(email)) {
      return jsonError("Please enter a valid email address.");
    }

    const supabase = createAdminClient();
    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("id, title, price, currency, status")
      .eq("id", bookId)
      .eq("status", "published")
      .maybeSingle();

    if (bookError || !book) {
      return jsonError("Published book not found.", 404);
    }

    const amount = Number(book.price);

    if (!amount || amount <= 0) {
      return jsonError("This book is not available for payment yet.");
    }

    const reference = createPaymentReference();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        book_id: book.id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        amount,
        currency: book.currency || "NGN",
        paystack_reference: reference,
        payment_status: "pending",
        delivery_status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return jsonError("Unable to create pending order.");
    }

    const paystack = await initializePaystackTransaction({
      amount: nairaToKobo(amount),
      email,
      reference,
      metadata: {
        orderId: order.id,
        bookId: book.id,
        customerName: name,
        customerEmail: email,
      },
    });

    if (!paystack.status || !paystack.data?.authorization_url) {
      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", order.id);

      return jsonError(paystack.message || "Unable to initialize Paystack payment.");
    }

    return jsonOk({
      authorizationUrl: paystack.data.authorization_url,
      reference: paystack.data.reference,
      orderId: order.id,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to initialize payment.");
  }
}

function text(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
