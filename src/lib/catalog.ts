import { createAdminClient } from "@/lib/supabase/server";
import type { Author, Book } from "@/types";

type DbAuthor = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  role_title: string | null;
  ministry_name: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  linkedin_url: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
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
  is_featured: boolean | null;
  is_physical_available: boolean | null;
  authors: DbAuthor | null;
};

const PUBLISHED_BOOK_STATUS = "published";

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
    author: author?.name || "The Scribe House",
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
    status: "Available",
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
        "A well-structured message for careful reading.",
        "Biblical encouragement for faith and obedience.",
      ];
}

function mapAuthor(row: DbAuthor): Author {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    roleTitle: row.role_title || "Author",
    bio: row.bio || "The Scribe House author profile.",
    image: row.image_url || "",
    email: row.email || undefined,
    ministryName: row.ministry_name || undefined,
    websiteUrl: row.website_url || undefined,
    facebookUrl: row.facebook_url || undefined,
    instagramUrl: row.instagram_url || undefined,
    xUrl: row.x_url || undefined,
    linkedinUrl: row.linkedin_url || undefined,
    status: row.status === "hidden" ? "hidden" : "active",
    createdAt: row.created_at || undefined,
    updatedAt: row.updated_at || undefined,
  };
}

export async function getPublishedBooks(): Promise<Book[]> {
  if (!hasSupabaseServerEnv()) {
    return [];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select("*, authors(*)")
    .eq("status", PUBLISHED_BOOK_STATUS)
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return (data as DbBook[]).map(mapBook);
}

export async function getFeaturedPublishedBooks(limit = 3): Promise<Book[]> {
  if (!hasSupabaseServerEnv()) {
    return [];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select("*, authors(*)")
    .eq("status", PUBLISHED_BOOK_STATUS)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) {
    return [];
  }

  return (data as DbBook[]).map(mapBook);
}

export async function getPublishedBookBySlug(slug: string): Promise<Book | undefined> {
  if (!hasSupabaseServerEnv()) {
    return undefined;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select("*, authors(*)")
    .eq("slug", slug)
    .eq("status", PUBLISHED_BOOK_STATUS)
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return mapBook(data as DbBook);
}

export async function getPublishedBooksByAuthor(authorId: string): Promise<Book[]> {
  if (!hasSupabaseServerEnv()) {
    return [];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select("*, authors(*)")
    .eq("status", PUBLISHED_BOOK_STATUS)
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return (data as DbBook[]).map(mapBook);
}

export async function getAuthorsFromCatalog(): Promise<Author[]> {
  if (!hasSupabaseServerEnv()) {
    return [];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return ((data || []) as DbAuthor[]).map(mapAuthor);
}

export async function getAuthorBySlugFromCatalog(slug: string): Promise<Author | undefined> {
  const authors = await getAuthorsFromCatalog();
  return authors.find((author) => author.slug === slug);
}
