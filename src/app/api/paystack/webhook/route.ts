import {
  fulfillPaidOrder,
  verifyPaystackTransaction,
  verifyPaystackWebhookSignature,
} from "@/lib/paystack";
import { jsonError, jsonOk } from "@/lib/utils";

type PaystackWebhookEvent = {
  event?: string;
  data?: {
    reference?: string;
    amount?: number;
    status?: string;
    paid_at?: string;
    paidAt?: string;
  };
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!signature) {
    return jsonError("Missing Paystack signature.", 401);
  }

  try {
    const isValid = verifyPaystackWebhookSignature(body, signature);

    if (!isValid) {
      return jsonError("Invalid Paystack signature.", 401);
    }

    const event = JSON.parse(body) as PaystackWebhookEvent;

    if (event.event !== "charge.success" || !event.data?.reference) {
      return jsonOk({ received: true, ignored: true });
    }

    const verified = await verifyPaystackTransaction(event.data.reference);

    if (!verified.status || !verified.data || verified.data.status !== "success") {
      return jsonError("Webhook transaction could not be verified.", 400);
    }

    const confirmation = await fulfillPaidOrder({
      reference: verified.data.reference,
      paystackAmount: verified.data.amount,
      paidAt: verified.data.paid_at || verified.data.paidAt,
    });

    return jsonOk(confirmation, "Webhook processed.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Webhook processing failed.");
  }
}
