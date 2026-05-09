import type { Metadata } from "next";
import Link from "next/link";
import { AdminAuthorForm } from "@/components/admin/AdminAuthorForm";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Create Author",
};

export default async function NewAuthorPage() {
  await requireAdmin();

  return (
    <div>
      <Link
        href="/admin/authors"
        className="text-sm font-bold text-red-700 transition hover:text-red-800"
      >
        Back to authors
      </Link>
      <h1 className="mt-4 text-4xl font-black text-neutral-950">Create Author</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-650">
        Add an author, minister, or ministry voice to the public authors page.
      </p>
      <div className="mt-8">
        <AdminAuthorForm mode="create" />
      </div>
    </div>
  );
}
