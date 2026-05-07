import type { Metadata } from "next";
import { AuthorCard } from "@/components/AuthorCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getAuthorsFromCatalog } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Authors",
  description: "Meet authors and ministry voices published by KD Global Publishing House.",
  path: "/authors",
});

export default async function AuthorsPage() {
  const authors = await getAuthorsFromCatalog();

  return (
    <section className="bg-neutral-50 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          headingLevel="h1"
          title="Authors"
          description="KD Global Publishing House publishes Christian authors, ministers, and ministry voices with truth-filled books for lasting impact."
        />
        {authors.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {authors.map((author) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-8 text-neutral-650">
            Author profiles will appear here soon.
          </div>
        )}
      </div>
    </section>
  );
}
