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
  const categories = Array.from(new Set(books.map((book) => book.category)));

  return (
    <section className="bg-neutral-50 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Bookstore"
          description="Explore eBooks, sermon books, devotionals, and Christian teaching resources from KD Global Publishing House."
          headingLevel="h1"
        />
        <div className="mt-8 grid gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
          <label className="grid gap-2 text-sm font-semibold text-neutral-800">
            Search books
            <input
              type="search"
              placeholder="Search by title, author, or topic"
              className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-neutral-800">
            Category
            <select className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100">
              <option>All categories</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
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
