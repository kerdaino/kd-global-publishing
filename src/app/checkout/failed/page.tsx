import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout Failed",
  description: "Get help after an incomplete KD Global Publishing House checkout.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutFailedPage() {
  return (
    <section className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Payment Not Completed
        </p>
        <h1 className="mt-4 text-4xl font-black text-neutral-950">
          Checkout could not be completed.
        </h1>
        <p className="mt-5 text-base leading-8 text-neutral-650">
          Please return to the bookstore and try again, or contact KD Global
          Publishing House for support.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/bookstore" className="inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800">
            Back to Bookstore
          </Link>
          <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-950 transition hover:border-red-700 hover:text-red-700">
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
