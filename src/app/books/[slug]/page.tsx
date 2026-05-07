import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { BookCheckoutForm } from "@/components/forms/BookCheckoutForm";
import { books } from "@/data/books";
import { getBookBySlugFromCatalog } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/metadata";

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlugFromCatalog(slug);

  if (!book) {
    return {
      title: "Book Not Found",
    };
  }

  return createPageMetadata({
    title: book.title,
    description: book.shortDescription,
    path: `/books/${book.slug}`,
  });
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await getBookBySlugFromCatalog(slug);

  if (!book) {
    notFound();
  }

  const canCheckout = book.status === "Available" && Boolean(book.id);

  return (
    <>
      <section className="bg-neutral-50 px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.7fr_1fr_0.72fr] xl:items-start">
          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white p-4 shadow-xl">
              <div className="flex aspect-[4/5] items-center justify-center rounded-md bg-gradient-to-br from-neutral-950 via-red-950 to-red-700 p-8 text-center text-white">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-100">
                    KD Global
                  </p>
                  <h1 className="mt-10 text-4xl font-black tracking-tight sm:text-5xl">
                    {book.title}
                  </h1>
                  {book.subtitle ? (
                    <p className="mt-4 text-sm font-medium text-red-100">
                      {book.subtitle}
                    </p>
                  ) : null}
                  <p className="mt-10 text-sm font-medium text-red-100">
                    {book.author}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-md bg-neutral-50 p-4 text-sm leading-7 text-neutral-650">
                Cover image placeholder. Real cover artwork can be connected
                later through <span className="font-semibold">coverImage</span>.
              </div>
            </div>
          </aside>

          <article className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              {book.category}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl">
              {book.title}
            </h1>
            {book.subtitle ? (
              <p className="mt-3 text-xl font-semibold text-neutral-700">
                {book.subtitle}
              </p>
            ) : null}
            <p className="mt-3 text-lg text-neutral-600">by {book.author}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Category", value: book.category },
                { label: "Format", value: book.format },
                { label: "Price", value: book.price },
                { label: "Status", value: book.status },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-neutral-200 bg-neutral-50 p-4"
                >
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-base font-bold text-neutral-950">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-neutral-200 pt-8">
              <h2 className="text-2xl font-bold text-neutral-950">
                About this book
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-650">
                {book.description}
              </p>
            </div>

            <div className="mt-10 rounded-lg bg-neutral-950 p-6 text-white">
              <h2 className="text-2xl font-bold">What readers will learn</h2>
              <ul className="mt-6 grid gap-4">
                {book.whatReadersWillLearn.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-white/10 bg-white/5 p-4 text-base leading-7 text-neutral-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <aside className="grid gap-5 xl:sticky xl:top-28">
            <BookCheckoutForm
              bookId={book.id}
              disabled={!canCheckout}
              price={book.price}
            />

            <div className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
              <Link
                href="/bookstore"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-950 transition hover:-translate-y-0.5 hover:border-red-700 hover:text-red-700"
              >
                Back to Bookstore
              </Link>
              {book.sampleFileUrl ? (
                <Link
                  href={book.sampleFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-950 transition hover:-translate-y-0.5 hover:border-red-700 hover:text-red-700"
                >
                  Download Sample
                </Link>
              ) : null}
            </div>

            {book.isPhysicalAvailable ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                <h2 className="text-xl font-black text-neutral-950">
                  Want a physical copy?
                </h2>
                <p className="mt-2 text-sm leading-7 text-neutral-650">
                  This title can be prepared for physical ordering and print
                  coordination.
                </p>
                <Link
                  href="/print-request"
                  className="mt-4 inline-flex rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
                >
                  Request Physical Copy
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <CTASection
        title="Want to publish your own book?"
        description="KD Global Publishing House helps authors, ministers, and ministries turn manuscripts, sermons, and Christian teachings into well-edited books prepared for readers."
        primaryLabel="Start a Publishing Inquiry"
        primaryHref="/contact"
        secondaryLabel="View Publishing Services"
        secondaryHref="/publishing-services"
      />
    </>
  );
}
