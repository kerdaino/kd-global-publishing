import crypto from "node:crypto";
import {
  DOWNLOAD_TOKEN_EXPIRY_DAYS,
  DOWNLOAD_TOKEN_MAX_DOWNLOADS,
} from "@/lib/download-policy";
import { createAdminClient } from "@/lib/supabase/server";

type DownloadTokenRecord = {
  id: string;
  token: string;
  expires_at: string | null;
  download_count: number | null;
  max_downloads: number | null;
  orders: {
    id: string;
    customer_email: string;
    payment_status: string | null;
    books: {
      title: string;
      ebook_file_url: string | null;
      ebook_file_path: string | null;
    } | null;
  } | null;
};

export type ValidDownloadToken = {
  token: string;
  orderId: string;
  bookTitle: string;
  customerEmail: string;
  ebookFileUrl: string | null;
  ebookFilePath: string | null;
  downloadCount: number;
  maxDownloads: number;
  downloadsRemaining: number;
  expiresAt: string | null;
};

export type DownloadTokenValidation =
  | { ok: true; data: ValidDownloadToken }
  | { ok: false; error: string };

export function generateDownloadToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createDownloadTokenForOrder(
  orderId: string,
  options?: {
    expiryDays?: number;
    maxDownloads?: number;
  },
) {
  const supabase = createAdminClient();

  const { data: existingToken } = await supabase
    .from("download_tokens")
    .select("token")
    .eq("order_id", orderId)
    .maybeSingle();

  if (existingToken?.token) {
    return existingToken as { token: string };
  }

  const expiryDays = options?.expiryDays ?? DOWNLOAD_TOKEN_EXPIRY_DAYS;
  const maxDownloads = options?.maxDownloads ?? DOWNLOAD_TOKEN_MAX_DOWNLOADS;
  const expiresAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * expiryDays,
  ).toISOString();

  const { data, error } = await supabase
    .from("download_tokens")
    .insert({
      order_id: orderId,
      token: generateDownloadToken(),
      expires_at: expiresAt,
      max_downloads: maxDownloads,
      download_count: 0,
    })
    .select("token")
    .single();

  if (error || !data) {
    throw new Error("Unable to create download token.");
  }

  return data as { token: string };
}

export async function validateDownloadToken(
  token: string,
): Promise<DownloadTokenValidation> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("download_tokens")
    .select(
      "id, token, expires_at, download_count, max_downloads, orders(id, customer_email, payment_status, books(title, ebook_file_url, ebook_file_path))",
    )
    .eq("token", token)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "This download link is invalid." };
  }

  const record = data as unknown as DownloadTokenRecord | {
    id: string;
    token: string;
    expires_at: string | null;
    download_count: number | null;
    max_downloads: number | null;
    orders: DownloadTokenRecord["orders"] | DownloadTokenRecord["orders"][];
  };
  const order = Array.isArray(record.orders) ? record.orders[0] : record.orders;
  const book = Array.isArray(order?.books) ? order.books[0] : order?.books;

  if (!order) {
    return { ok: false, error: "This download link cannot be verified." };
  }

  if (order.payment_status !== "paid") {
    return { ok: false, error: "This order has not been paid." };
  }

  if (record.expires_at && new Date(record.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "This download link has expired." };
  }

  const downloadCount = record.download_count ?? 0;
  const maxDownloads = record.max_downloads ?? DOWNLOAD_TOKEN_MAX_DOWNLOADS;

  if (downloadCount >= maxDownloads) {
    return {
      ok: false,
      error: "This download link has reached its maximum number of downloads.",
    };
  }

  if (!book?.ebook_file_path && !book?.ebook_file_url) {
    return { ok: false, error: "This book does not have an eBook file attached yet." };
  }

  return {
    ok: true,
    data: {
      token: record.token,
      orderId: order.id,
      bookTitle: book.title,
      customerEmail: order.customer_email,
      ebookFileUrl: book.ebook_file_url,
      ebookFilePath: book.ebook_file_path,
      downloadCount,
      maxDownloads,
      downloadsRemaining: maxDownloads - downloadCount,
      expiresAt: record.expires_at,
    },
  };
}

export async function incrementDownloadCount(token: string) {
  const validation = await validateDownloadToken(token);

  if (!validation.ok) {
    return validation;
  }

  const supabase = createAdminClient();
  const nextCount = validation.data.downloadCount + 1;
  const { error } = await supabase
    .from("download_tokens")
    .update({ download_count: nextCount })
    .eq("token", token);

  if (error) {
    return { ok: false, error: "Unable to record this download." } as const;
  }

  return validation;
}

export async function getDownloadUrl({
  ebookFilePath,
  ebookFileUrl,
}: {
  ebookFilePath?: string | null;
  ebookFileUrl?: string | null;
}) {
  if (ebookFilePath) {
    return createSignedStorageUrl(
      "ebook-files",
      normalizeEbookFilePath(ebookFilePath),
      60 * 5,
    );
  }

  if (!ebookFileUrl) {
    throw new Error("No eBook file is available for this download.");
  }

  if (ebookFileUrl.startsWith("http://") || ebookFileUrl.startsWith("https://")) {
    return ebookFileUrl;
  }

  const [bucket, ...pathParts] = ebookFileUrl.split("/");
  const path = pathParts.join("/");

  if (!bucket || !path) {
    return createSignedStorageUrl("ebook-files", ebookFileUrl, 60 * 5);
  }

  return createSignedStorageUrl(bucket, path, 60 * 5);
}

function normalizeEbookFilePath(value: string) {
  return value.trim().replace(/^ebook-files\//, "").replace(/^\/+/, "");
}

async function createSignedStorageUrl(
  bucket: string,
  path: string,
  expiresIn: number,
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error("Unable to create signed download URL.");
  }

  return data.signedUrl;
}
