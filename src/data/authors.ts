import type { Author } from "@/types";

export const authors: Author[] = [
  {
    name: "KD Global Author",
    slug: "to-be-updated",
    role: "Featured Author",
    bio: "KD Global Publishing House features Christian authors, ministers, and ministry voices whose books serve readers with truth-filled teaching.",
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
