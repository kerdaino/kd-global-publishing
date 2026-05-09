"use client";

import { useId, useState } from "react";
import { downloadPolicyText } from "@/lib/download-policy";

type CheckoutState = "idle" | "loading" | "error";

export function BookCheckoutForm({
  bookId,
  disabled,
  price,
}: {
  bookId?: string;
  disabled?: boolean;
  price: string;
}) {
  const formId = useId();
  const errorId = `${formId}-error`;
  const [state, setState] = useState<CheckoutState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!bookId) {
      setState("error");
      setError("Online checkout is not open for this title.");
      return;
    }

    setState("loading");
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    if (!name || !email) {
      setState("error");
      setError("Please enter your full name and email address.");
      return;
    }

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          name,
          email,
          phone,
        }),
      });

      const result = await response.json();

      const authorizationUrl =
        result.data?.authorization_url || result.data?.authorizationUrl;

      if (!result.ok || !authorizationUrl) {
        setState("error");
        setError(result.error || "Unable to start checkout.");
        return;
      }

      window.location.href = authorizationUrl;
    } catch {
      setState("error");
      setError("Unable to connect to checkout. Please try again.");
    }
  }

  if (disabled || !bookId) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
          Purchase
        </p>
        <p className="mt-3 text-4xl font-black tracking-tight text-neutral-950">
          {price}
        </p>
        <div className="mt-5 rounded-md border border-neutral-200 bg-neutral-100 p-4">
          <p className="text-sm font-bold text-neutral-700">
            Purchase not open
          </p>
          <p className="mt-2 text-sm leading-7 text-neutral-600">
            Online checkout is not open for this title.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby={error ? errorId : undefined}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-950/5"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
        Secure eBook purchase
      </p>
      <div className="mt-3 border-b border-neutral-200 pb-5">
        <h2 className="text-2xl font-black text-neutral-950">
          Buy this eBook
        </h2>
        <p className="mt-3 text-4xl font-black tracking-tight text-neutral-950">
          {price}
        </p>
      </div>
      <p className="mt-5 text-sm leading-7 text-neutral-650">
        Enter your details and continue to secure Paystack checkout. After your
        payment is confirmed, your download link will be sent to your email address.
      </p>
      <div className="mt-5 grid gap-4">
        <label htmlFor={`${formId}-name`} className="grid gap-2 text-sm font-semibold text-neutral-800">
          Full name
          <input
            id={`${formId}-name`}
            name="name"
            required
            className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          />
        </label>
        <label htmlFor={`${formId}-email`} className="grid gap-2 text-sm font-semibold text-neutral-800">
          Email address
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          />
        </label>
        <label htmlFor={`${formId}-phone`} className="grid gap-2 text-sm font-semibold text-neutral-800">
          WhatsApp / phone optional
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-wait disabled:bg-neutral-400"
      >
        {state === "loading" ? "Redirecting..." : "Buy Now"}
      </button>
      <p className="mt-4 rounded-md bg-neutral-50 p-4 text-sm leading-7 text-neutral-650">
        {downloadPolicyText()}
      </p>
      {error ? (
        <p id={errorId} role="alert" className="mt-4 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
