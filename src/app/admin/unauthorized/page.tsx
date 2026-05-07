import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized",
};

export default function AdminUnauthorizedPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
        Unauthorized
      </p>
      <h1 className="mt-4 text-4xl font-black text-neutral-950">
        You do not have admin access.
      </h1>
      <p className="mt-4 text-neutral-650">
        Your account is signed in, but it is not listed in the `admin_users`
        table.
      </p>
      <Link
        href="/admin/login"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
      >
        Back to Login
      </Link>
    </div>
  );
}
