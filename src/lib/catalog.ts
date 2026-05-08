import { authors as fallbackAuthors } from "@/data/authors";
import { books as fallbackBooks } from "@/data/books";
import { createAdminClient } from "@/lib/supabase/server";
import type { Author, Book } from "@/types";

type DbAuthor = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  image_url: string | null;
  email: string | null;
};

type DbBook = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  category: string | null;
  description: string | null;
  short_description: string | null;
  price: number;
  currency: string | null;
  cover_image_url: string | null;
  sample_file_url: string | null;
  sample_file_path: string | null;
  ebook_file_url: string | null;
  ebook_file_path: string | null;
  payment_link: string | null;
  what_readers_will_learn: string[] | null;
  format: string | null;
  status: string | null;
  is_physical_available: boolean | null;
  authors: DbAuthor | null;
};

function hasSupabaseServerEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function formatPrice(amount: number, currency = "NGN") {
  if (!amount) {
    return "Price to be announced";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function mapBook(row: DbBook): Book {
  const author = row.authors;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle || undefined,
    author: author?.name || "KD Global Publishing House",
    authorSlug: author?.slug || "kd-global-publishing-house",
    category: row.category || "Christian Teaching",
    price: formatPrice(Number(row.price), row.currency || "NGN"),
    priceInKobo: Number(row.price) * 100,
    coverImage: row.cover_image_url || "",
    sampleFileUrl: row.sample_file_url || "",
    sampleFilePath: row.sample_file_path || undefined,
    shortDescription: row.short_description || "",
    description: row.description || "",
    whatReadersWillLearn: parseList(row.what_readers_will_learn),
    format: row.format === "PDF eBook" ? "eBook PDF" : "eBook PDF",
    status: row.status === "published" ? "Available" : "Available Soon",
    isPhysicalAvailable: Boolean(row.is_physical_available),
    paymentLink: row.payment_link || "",
    downloadFilePath: row.ebook_file_path || undefined,
  };
}

function parseList(value: string[] | null) {
  const items = (value || [])
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length
    ? items
    : [
        "Clear Christian teaching for practical growth.",
        "A structured message prepared for careful reading.",
        "Biblical encouragement for faith and obedience.",
      ];
}

function mapAuthor(row: DbAuthor): Author {
  return {
    name: row.name,
    slug: row.slug,
    role: "Author",
    bio: row.bio || "KD Global Publishing House author profile.",
    image: row.image_url || "",
  };
}

export async function getPublishedBooks(): Promise<Book[]> {
  if (!hasSupabaseServerEnv()) {
    return fallbackBooks;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select("*, authors(*)")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return fallbackBooks;
  }

  return (data as DbBook[]).map(mapBook);
}

export async function getBookBySlugFromCatalog(slug: string): Promise<Book | undefined> {
  if (!hasSupabaseServerEnv()) {
    return fallbackBooks.find((book) => book.slug === slug);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select("*, authors(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return fallbackBooks.find((book) => book.slug === slug);
  }

  return mapBook(data as DbBook);
}

export async function getAuthorsFromCatalog(): Promise<Author[]> {
  if (!hasSupabaseServerEnv()) {
    return fallbackAuthors;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return fallbackAuthors;
  }

  return (data as DbAuthor[]).map(mapAuthor);
}

export async function getAuthorBySlugFromCatalog(slug: string): Promise<Author | undefined> {
  const authors = await getAuthorsFromCatalog();
  return authors.find((author) => author.slug === slug);
}
