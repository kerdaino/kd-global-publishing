import {
  fulfillPaidOrder,
  verifyPaystackTransaction,
} from "@/lib/paystack";
import { jsonError, jsonOk } from "@/lib/utils";

async function handleVerify(reference: string | null) {
  if (!reference) {
    return jsonError("Payment reference is required.");
  }

  const result = await verifyPaystackTransaction(reference);

  if (!result.status || !result.data) {
    return jsonError(result.message || "Unable to verify transaction.");
  }

  if (result.data.status !== "success") {
    console.info("Paystack verification status", {
      paystackReference: result.data.reference,
      paidAmount: result.data.amount,
      verificationStatus: result.data.status,
    });
    return jsonError(`Payment status is ${result.data.status}.`, 402);
  }

  console.info("Paystack verification status", {
    paystackReference: result.data.reference,
    paidAmount: result.data.amount,
    verificationStatus: result.data.status,
  });

  const confirmation = await fulfillPaidOrder({
    reference: result.data.reference,
    paystackAmount: result.data.amount,
    paystackStatus: result.data.status,
    paidAt: result.data.paid_at || result.data.paidAt,
  });

  return jsonOk(confirmation, "Payment verified.");
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    return await handleVerify(reference);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to verify payment.");
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { reference?: string; trxref?: string };
    return await handleVerify(payload.reference || payload.trxref || null);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to verify payment.");
  }
}
