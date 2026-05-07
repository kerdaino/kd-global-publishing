import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getDownloadUrl,
  incrementDownloadCount,
  validateDownloadToken,
} from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Secure Download",
  description: "Secure eBook download page for KD Global Publishing House customers.",
  robots: {
    index: false,
    follow: false,
  },
};

type DownloadPageProps = {
  params: Promise<{ token: string }>;
};

async function downloadEbook(token: string) {
  "use server";

  const result = await incrementDownloadCount(token);

  if (!result.ok) {
    redirect(`/download/${token}?error=${encodeURIComponent(result.error)}`);
  }

  const downloadUrl = await getDownloadUrl({
    ebookFilePath: result.data.ebookFilePath,
    ebookFileUrl: result.data.ebookFileUrl,
  });
  redirect(downloadUrl);
}

export default async function DownloadPage({
  params,
  searchParams,
}: DownloadPageProps & {
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error: actionError } = await searchParams;
  const result = await validateDownloadToken(token);

  if (!result.ok) {
    return <DownloadError message={result.error} />;
  }

  const downloadAction = downloadEbook.bind(null, token);

  return (
    <section className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Secure eBook Download
        </p>
        <h1 className="mt-4 text-4xl font-black text-neutral-950">
          {result.data.bookTitle}
        </h1>
        <div className="mt-6 grid gap-4 rounded-lg bg-neutral-50 p-5 text-sm leading-7 text-neutral-650 sm:grid-cols-2">
          <div>
            <p className="font-bold text-neutral-950">Customer email</p>
            <p className="mt-1">{result.data.customerEmail}</p>
          </div>
          <div>
            <p className="font-bold text-neutral-950">Downloads remaining</p>
            <p className="mt-1">
              {result.data.downloadsRemaining} of {result.data.maxDownloads}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="font-bold text-neutral-950">Expires</p>
            <p className="mt-1">
              {result.data.expiresAt
                ? new Intl.DateTimeFormat("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(result.data.expiresAt))
                : "No expiry set"}
            </p>
          </div>
        </div>
        {actionError ? (
          <p className="mt-5 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">
            {actionError}
          </p>
        ) : null}
        <form action={downloadAction}>
          <button
            type="submit"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5 hover:bg-red-800 sm:w-auto"
          >
            Download eBook
          </button>
        </form>
      </div>
    </section>
  );
}

function DownloadError({ message }: { message: string }) {
  return (
    <section className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Download unavailable
        </p>
        <h1 className="mt-4 text-4xl font-black text-neutral-950">
          This eBook link cannot be used.
        </h1>
        <p className="mt-5 text-base leading-8 text-neutral-650">{message}</p>
        <Link
          href="/contact"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
        >
          Contact Support
        </Link>
      </div>
    </section>
  );
}
