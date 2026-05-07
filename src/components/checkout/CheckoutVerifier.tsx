"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type VerifyState = {
  status: "loading" | "success" | "error";
  message: string;
  details?: {
    bookTitle: string;
    customerEmail: string;
    downloadUrl: string;
    reference: string;
  };
};

export function CheckoutVerifier({ reference }: { reference?: string }) {
  const [state, setState] = useState<VerifyState>({
    status: "loading",
    message: "Verifying your payment...",
  });

  useEffect(() => {
    async function verifyPayment() {
      if (!reference) {
        setState({
          status: "error",
          message: "No payment reference was found.",
        });
        return;
      }

      try {
        const response = await fetch(
          `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
        );
        const result = await response.json();

        if (!result.ok) {
          setState({
            status: "error",
            message: result.error || "Payment verification failed.",
          });
          return;
        }

        setState({
          status: "success",
          message: "Payment confirmed. Your download email has been prepared.",
          details: result.data,
        });
      } catch {
        setState({
          status: "error",
          message:
            "We could not reach the payment verification service. Please refresh this page or contact support with your payment reference.",
        });
      }
    }

    verifyPayment();
  }, [reference]);

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
        Checkout
      </p>
      <h1 className="mt-4 text-4xl font-black text-neutral-950">
        {state.status === "success"
          ? "Your payment was successful."
          : state.status === "error"
            ? "We could not verify this payment."
            : "Verifying payment..."}
      </h1>
      <p className="mt-5 text-base leading-8 text-neutral-650">
        {state.message}
      </p>
      {state.details ? (
        <div className="mt-6 rounded-lg bg-neutral-50 p-5 text-left text-sm leading-7 text-neutral-650">
          <p>
            <strong className="text-neutral-950">Book:</strong>{" "}
            {state.details.bookTitle}
          </p>
          <p>
            <strong className="text-neutral-950">Email:</strong>{" "}
            {state.details.customerEmail}
          </p>
          <p>
            <strong className="text-neutral-950">Reference:</strong>{" "}
            {state.details.reference}
          </p>
          <Link
            href={state.details.downloadUrl}
            className="mt-4 inline-flex rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
          >
            Open Download Page
          </Link>
        </div>
      ) : null}
      <Link
        href="/bookstore"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-950 transition hover:border-red-700 hover:text-red-700"
      >
        Back to Bookstore
      </Link>
    </div>
  );
}
