import Link from "next/link";
import type { Book } from "@/types";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  const isAvailable = book.status === "Available";
  const actionLabel = isAvailable ? "View Book" : "Preview Book";
  const coverImage = book.coverImage?.trim();

  return (
    <article className="group grid h-full min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">
      <Link
        href={`/books/${book.slug}`}
        className="block min-w-0 overflow-hidden rounded-t-lg"
      >
        {coverImage ? (
          <div className="aspect-[5/8] w-full overflow-hidden rounded-t-lg bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={`${book.title} cover`}
              className="block h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-[5/8] w-full items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-neutral-950 via-red-950 to-red-700 p-8 text-center text-white">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-100">
                The Scribe House
              </p>
              <p className="mt-8 break-words text-3xl font-black tracking-tight sm:text-4xl">
                {book.title}
              </p>
              <p className="mt-8 text-sm font-medium text-red-100">
                {book.author}
              </p>
            </div>
          </div>
        )}
      </Link>
      <div className="flex min-w-0 flex-col p-6">
        <h3 className="mt-2 text-xl font-bold text-neutral-950">
          <Link
            href={`/books/${book.slug}`}
            className="break-words transition group-hover:text-red-700"
          >
            {book.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-neutral-500">by {book.author}</p>
        <p className="mt-4 flex-1 text-sm leading-7 text-neutral-650">
          {book.shortDescription}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-neutral-600">
          <span className="rounded-md bg-neutral-950 px-3 py-1 text-white">
            {book.category}
          </span>
          <span className="rounded-md bg-neutral-100 px-3 py-1">
            {book.format}
          </span>
          <span
            className={
              isAvailable
                ? "rounded-md bg-neutral-950 px-3 py-1 text-white"
                : "rounded-md bg-red-50 px-3 py-1 text-red-700"
            }
          >
            {book.status}
          </span>
        </div>
        <div className="mt-6 flex min-w-0 flex-wrap items-center justify-between gap-4">
          <span className="min-w-0 break-words font-bold text-neutral-950">
            {book.price}
          </span>
          <Link
            href={`/books/${book.slug}`}
            className={
              isAvailable
                ? "inline-flex min-h-11 items-center justify-center rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-700"
                : "inline-flex min-h-11 items-center justify-center rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-200"
            }
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
