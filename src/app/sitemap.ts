import type { MetadataRoute } from "next";
import { books } from "@/data/books";
import { authors } from "@/data/authors";
import { getBaseUrl } from "@/lib/utils";

const staticRoutes = [
  "/",
  "/bookstore",
  "/authors",
  "/publishing-services",
  "/sermon-to-book",
  "/print-request",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const dynamicRoutes = [
    ...books.map((book) => `/books/${book.slug}`),
    ...authors.map((author) => `/authors/${author.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
