import type { Metadata } from "next";
import { loginAdmin } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; setup?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-4xl font-black text-neutral-950">Admin Login</h1>
      <p className="mt-3 text-base leading-8 text-neutral-650">
        Sign in with Supabase Auth. Only emails listed in `admin_users` can
        access the dashboard.
      </p>
      {params.setup ? (
        <p className="mt-5 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">
          Supabase admin environment variables are not fully configured.
        </p>
      ) : null}
      {params.error ? (
        <p className="mt-5 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">
          {params.error}
        </p>
      ) : null}
      <form
        action={loginAdmin}
        className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <label className="grid gap-2 text-sm font-semibold text-neutral-800">
          Email
          <input
            type="email"
            name="email"
            required
            className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          />
        </label>
        <label className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
          Password
          <input
            type="password"
            name="password"
            required
            className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          />
        </label>
        <button
          type="submit"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
