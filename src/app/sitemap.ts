import type { MetadataRoute } from "next";
import { getAuthorsFromCatalog, getPublishedBooks } from "@/lib/catalog";
import { getBaseUrl } from "@/lib/utils";

const staticRoutes = [
  "/",
  "/bookstore",
  "/authors",
  "/publishing-services",
  "/sermon-to-book",
  "/print-request",
  "/contact",
  "/terms",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const [books, authors] = await Promise.all([
    getPublishedBooks(),
    getAuthorsFromCatalog(),
  ]);
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
