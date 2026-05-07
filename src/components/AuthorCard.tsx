import Link from "next/link";
import type { Author } from "@/types";

export function AuthorCard({ author }: { author: Author }) {
  return (
    <article className="group rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
      <div className="flex size-16 items-center justify-center rounded-md bg-neutral-950 text-xl font-black text-white">
        {author.name.slice(0, 2).toUpperCase()}
      </div>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-red-700">
        {author.role}
      </p>
      <h2 className="mt-2 text-2xl font-black text-neutral-950 transition group-hover:text-red-700">
        <Link href={`/authors/${author.slug}`}>{author.name}</Link>
      </h2>
      <p className="mt-4 text-sm leading-7 text-neutral-650">{author.bio}</p>
      <Link
        href={`/authors/${author.slug}`}
        className="mt-6 inline-flex rounded-md bg-neutral-950 px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-700"
      >
        View Author
      </Link>
    </article>
  );
}
