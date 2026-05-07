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
    "KD Global Publishing House helps authors, ministers, and ministries turn manuscripts, sermons, and Christian teachings into beautifully edited, market-ready books.",
  path: "/",
});

const businessArms = [
  {
    title: "eBook Sales",
    description:
      "A focused Christian bookstore for digital books, devotionals, teaching resources, and ministry titles.",
    href: "/bookstore",
  },
  {
    title: "Publishing Services",
    description:
      "Editing, expansion, rewriting support, formatting, cover direction, launch support, and print preparation.",
    href: "/publishing-services",
  },
  {
    title: "Sermon-to-Book Production",
    description:
      "We turn sermons, retreats, conference messages, and teaching series into books that keep serving readers.",
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
              beautifully edited, market-ready books.
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
              Christian publishing platform
            </p>
            <h2 className="mt-5 text-3xl font-black tracking-tight">
              Write. Edit. Publish. Sell. Distribute.
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-300">
              Built for Christian books, sermon resources, eBooks, and future
              physical print coordination under the KD Global brand.
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
            title="Truth-filled books prepared for readers."
            description="Featured titles from KD Global Publishing House will appear here as books are published and released."
            align="center"
          />
          {featuredBooks.length ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredBooks.map((book) => (
                <BookCard key={book.slug} book={book} />
              ))}
            </div>
          ) : (
            <EmptyPanel message="Published books will appear here soon." />
          )}
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Business arms"
            title="A complete Christian publishing house."
            description="The platform is designed around sales, services, and sermon-to-book production so the business can grow beyond a simple website."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {businessArms.map((arm) => (
              <Link
                key={arm.title}
                href={arm.href}
                className="group rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
              >
                <div className="mb-5 h-1.5 w-14 rounded-full bg-red-700" />
                <h3 className="text-2xl font-black text-neutral-950 group-hover:text-red-700">
                  {arm.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-neutral-650">
                  {arm.description}
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
              We combine editorial structure, Christian sensitivity, product
              packaging, and digital sales preparation for authors and ministries.
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
        title="KD Global Publishing House is ready to build with authors and ministries."
        description="From the first eBook to future print distribution, the platform is prepared for a serious Christian publishing business."
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
