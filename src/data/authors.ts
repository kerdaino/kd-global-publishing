import type { Author } from "@/types";

export const authors: Author[] = [
  {
    name: "To be updated",
    slug: "to-be-updated",
    role: "Featured Author",
    bio: "The first KD Global Publishing House author profile will be updated as Mum’s first book moves toward launch. This profile is prepared for the author page, bookstore, and future book catalog.",
    image: "/authors/to-be-updated.jpg",
  },
  {
    name: "KD Global Publishing House",
    slug: "kd-global-publishing-house",
    role: "Publishing Brand",
    bio: "KD Global Publishing House develops Christian books, sermon resources, devotionals, and ministry teaching material for readers who value truth-filled publishing.",
    image: "/authors/kd-global-publishing-house.jpg",
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((author) => author.slug === slug);
}
