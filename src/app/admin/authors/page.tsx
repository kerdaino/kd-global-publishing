import type { Metadata } from "next";
import Link from "next/link";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { AdminAuthorDeleteButton } from "@/components/admin/AdminAuthorDeleteButton";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Authors" };

type AuthorStatusFilter = "active" | "hidden";

type AuthorRow = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  email: string | null;
  image_url: string | null;
  role_title: string | null;
  ministry_name: string | null;
  status: string | null;
  books?: { id: string }[] | null;
};

export default async function AdminAuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const selectedStatus = getStatusFilter(status);
  const supabase = createAdminClient();
  let authorsQuery = supabase
    .from("authors")
    .select("*, books(id)")
    .order("created_at", { ascending: false });

  if (selectedStatus) {
    authorsQuery = authorsQuery.eq("status", selectedStatus);
  }

  const { data } = await authorsQuery;
  const authors = (data || []) as AuthorRow[];

  return (
    <div>
      <h1 className="text-4xl font-black text-neutral-950">Author Management</h1>
      <p className="mt-3 max-w-3xl text-neutral-650">
        Create, edit, hide, and manage public author profiles.
      </p>
      <Link
        href="/admin/authors/new"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
      >
        Create New Author
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterLink label="All" href="/admin/authors" active={!selectedStatus} />
        <FilterLink
          label="Active"
          href="/admin/authors?status=active"
          active={selectedStatus === "active"}
        />
        <FilterLink
          label="Hidden"
          href="/admin/authors?status=hidden"
          active={selectedStatus === "hidden"}
        />
      </div>

      {authors.length ? (
        <div className="mt-8 grid gap-5">
          {authors.map((author) => {
            const bookCount = author.books?.length || 0;

            return (
              <article
                key={author.id}
                className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start"
              >
                <AuthorAvatar
                  image={author.image_url || undefined}
                  name={author.name}
                  className="size-20"
                  logoClassName="[&>span:first-child]:size-14"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black text-neutral-950">{author.name}</h2>
                    <span className="rounded-md bg-neutral-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-700">
                      {author.status || "active"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-neutral-500">/{author.slug}</p>
                  {author.role_title || author.ministry_name ? (
                    <p className="mt-3 text-sm font-semibold text-red-700">
                      {[author.role_title, author.ministry_name].filter(Boolean).join(" | ")}
                    </p>
                  ) : null}
                  <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-7 text-neutral-650">
                    {author.bio || "No bio saved yet."}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-neutral-700">
                    {bookCount === 1 ? "1 book" : `${bookCount} books`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 md:justify-end">
                  <Link
                    href={`/admin/authors/${author.id}/edit`}
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-neutral-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    Edit
                  </Link>
                  {author.status === "hidden" ? null : (
                    <AdminAuthorDeleteButton authorId={author.id} authorName={author.name} />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 text-neutral-650 shadow-sm">
          No authors found. Create the first author profile to connect books with
          ministry voices on the public site.
        </div>
      )}
    </div>
  );
}

function getStatusFilter(value: string | string[] | undefined): AuthorStatusFilter | null {
  const status = Array.isArray(value) ? value[0] : value;

  return status === "active" || status === "hidden" ? status : null;
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "inline-flex min-h-11 items-center justify-center rounded-md bg-neutral-950 px-4 py-2 text-sm font-bold text-white"
          : "inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-700 transition hover:border-red-700 hover:text-red-700"
      }
    >
      {label}
    </Link>
  );
}
