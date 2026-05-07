import type { ApiResult } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function jsonOk<T>(data: T, message?: string, init?: ResponseInit) {
  return Response.json({ ok: true, data, message } satisfies ApiResult<T>, init);
}

export function jsonError(error: string, status = 400) {
  return Response.json(
    { ok: false, error } satisfies ApiResult,
    { status },
  );
}

export function getBaseUrl() {
  const url = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  if (url.startsWith("http")) {
    return url;
  }

  return `https://${url}`;
}
