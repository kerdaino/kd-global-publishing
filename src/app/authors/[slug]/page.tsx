import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { BookCard } from "@/components/BookCard";
import { getAuthorBySlugFromCatalog, getPublishedBooks } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/metadata";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [];
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
          <AuthorAvatar
            image={author.image}
            name={author.name}
            className="aspect-square w-full rounded-lg"
            logoClassName="[&>span:first-child]:size-24 [&>span:first-child]:text-4xl"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              {author.roleTitle}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl">
              {author.name}
            </h1>
            {author.ministryName ? (
              <p className="mt-4 text-base font-bold text-neutral-800">
                {author.ministryName}
              </p>
            ) : null}
            <p className="mt-5 text-lg leading-8 text-neutral-650">{author.bio}</p>
            {author.websiteUrl ? (
              <Link
                href={author.websiteUrl}
                className="mt-5 inline-flex text-sm font-bold text-red-700 transition hover:text-red-800"
              >
                Visit website
              </Link>
            ) : null}
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
                Published books by this author will be listed here.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
