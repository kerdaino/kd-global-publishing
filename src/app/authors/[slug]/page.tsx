import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { authors } from "@/data/authors";
import { getAuthorBySlugFromCatalog, getPublishedBooks } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/metadata";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlugFromCatalog(slug);

  return createPageMetadata({
    title: author?.name || "Author Not Found",
    description: author?.bio || "Author profile from KD Global Publishing House.",
    path: `/authors/${slug}`,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlugFromCatalog(slug);

  if (!author) {
    notFound();
  }

  const catalogBooks = await getPublishedBooks();
  const authorBooks = catalogBooks.filter((book) => book.authorSlug === author.slug);

  return (
    <section className="bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 rounded-lg border border-neutral-200 bg-neutral-50 p-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div className="flex aspect-square items-center justify-center rounded-lg bg-neutral-950 text-5xl font-black text-white">
            {author.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              {author.role}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl">
              {author.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-neutral-650">{author.bio}</p>
            <Link
              href="/contact"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5 hover:bg-red-800"
            >
              Publishing Inquiry
            </Link>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-3xl font-black text-neutral-950">Books</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {authorBooks.length ? (
              authorBooks.map((book) => <BookCard key={book.slug} book={book} />)
            ) : (
              <p className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-neutral-650">
                Books for this author profile will appear here as they are prepared.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
