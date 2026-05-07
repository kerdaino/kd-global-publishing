"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Something went wrong
        </p>
        <h1 className="mt-4 text-4xl font-black text-neutral-950">
          This page could not load.
        </h1>
        <p className="mt-4 text-sm leading-7 text-neutral-650">
          Please try again or contact support if the issue continues.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}
