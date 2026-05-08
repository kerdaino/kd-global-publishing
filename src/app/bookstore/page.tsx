import type { Metadata } from "next";
import { BookCard } from "@/components/BookCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getPublishedBooks } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Bookstore",
  description:
    "Explore eBooks, sermon books, devotionals, and Christian teaching resources from KD Global Publishing House.",
  path: "/bookstore",
});

export default async function BookstorePage() {
  const books = await getPublishedBooks();

  return (
    <section className="bg-neutral-50 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Bookstore"
          description="Explore eBooks, sermon books, devotionals, and Christian teaching resources from KD Global Publishing House."
          headingLevel="h1"
        />
        {books.length ? (
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-neutral-950">
              No published books yet.
            </h2>
            <p className="mt-3 text-neutral-650">
              Books marked as published in Supabase will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
