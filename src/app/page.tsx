import type { Metadata } from "next";
import Link from "next/link";
import { BookCard } from "@/components/BookCard";
import { CTASection } from "@/components/CTASection";
import { SectionHeader } from "@/components/SectionHeader";
import { getPublishedBooks } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Christian Publishing, eBooks, and Sermon-to-Book Services",
  description:
    "KD Global Publishing House helps Christian authors, ministers, and ministries shape manuscripts, sermons, and teachings into excellent books.",
  path: "/",
});

const whatWeDo = [
  {
    title: "eBook Publishing & Sales",
    description:
      "Christian eBooks, devotionals, sermon books, and ministry resources prepared for readers who value sound teaching.",
    href: "/bookstore",
  },
  {
    title: "Publishing Services",
    description:
      "Careful editing, manuscript development, formatting, cover direction, publishing support, and print preparation for authors and ministries.",
    href: "/publishing-services",
  },
  {
    title: "Sermon-to-Book Production",
    description:
      "We help transform sermons, conference teachings, retreats, and message series into books that continue impacting lives long after the meeting ends.",
    href: "/sermon-to-book",
  },
];

const whyPublish = [
  "We help structure your message",
  "We preserve sound teaching",
  "We prepare books for digital sales",
  "We support physical print preparation",
];

export default async function Home() {
  const books = await getPublishedBooks();
  const featuredBooks = books.slice(0, 3);

  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
              KD Global Publishing House
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-neutral-950 sm:text-6xl">
              Publish truth-filled books that teach, transform, and endure.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-650">
              KD Global Publishing House helps authors, ministers, and
              ministries turn manuscripts, sermons, and Christian teachings into
              well-edited books ready to serve readers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/bookstore"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5 hover:bg-red-800"
              >
                Explore Bookstore
              </Link>
              <Link
                href="/publishing-services"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-950 transition hover:-translate-y-0.5 hover:border-red-700 hover:text-red-700"
              >
                Start Publishing
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-neutral-950 p-6 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
              Christian publishing care
            </p>
            <h2 className="mt-5 text-3xl font-black tracking-tight">
              Write. Edit. Publish. Sell. Distribute.
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-300">
              Editorial care, digital publishing, and print preparation for
              Christian books, sermon resources, and ministry teaching.
            </p>
            <div className="mt-8 grid gap-3">
              {["Manuscripts", "Sermons", "Teachings", "Devotionals"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-md border border-white/10 bg-white/5 p-4 text-sm font-bold"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Featured Books"
            title="Truth-filled books for thoughtful readers."
            description="Explore published titles from KD Global Publishing House."
            align="center"
          />
          {featuredBooks.length ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredBooks.map((book) => (
                <BookCard key={book.slug} book={book} />
              ))}
            </div>
          ) : (
            <EmptyPanel message="New titles are in editorial preparation. Please check back for the published catalog." />
          )}
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="What We Do"
            title="More than a bookstore."
            description="KD Global Publishing House helps Christian books, teachings, and ministry resources move from message to manuscript to reader."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {whatWeDo.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="h-1.5 w-14 rounded-full bg-red-700" />
                  <span className="text-sm font-black text-neutral-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-neutral-950 transition group-hover:text-red-700">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-neutral-650 md:text-base">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-6 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
              Why publish with us
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Serious care for messages that carry spiritual weight.
            </h2>
            <p className="mt-5 text-base leading-8 text-neutral-300">
              We bring editorial structure, Christian sensitivity, careful
              presentation, and practical publishing support to work that matters.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyPublish.map((item) => (
              <div
                key={item}
                className="rounded-md border border-white/10 bg-white/5 p-5 text-sm font-bold text-neutral-100"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8">
            <h2 className="text-3xl font-black text-neutral-950">
              Find Christian books and resources.
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-650">
              Browse eBooks, devotionals, sermon books, and teaching resources.
            </p>
            <Link
              href="/bookstore"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
            >
              Go to Bookstore
            </Link>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-950 p-8 text-white">
            <h2 className="text-3xl font-black">
              Start a publishing project.
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-300">
              Bring a manuscript, teaching outline, or sermon archive and let us
              help shape it into a book.
            </p>
            <Link
              href="/publishing-services"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
            >
              Start Publishing
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Publish your message with care and conviction."
        description="From eBook publishing to print preparation, we help Christian authors and ministries publish with clarity, care, and purpose."
        primaryLabel="Contact Us"
        primaryHref="/contact"
        secondaryLabel="View Services"
        secondaryHref="/publishing-services"
      />
    </>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-650">
      {message}
    </div>
  );
}
