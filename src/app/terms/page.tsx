import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Terms & Refund Policy",
  description: "Terms, purchase conditions, download access, and refund policy for KD Global Publishing House.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <section className="bg-neutral-50 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Policy
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-950">
          Terms & Refund Policy
        </h1>
        <p className="mt-5 text-base leading-8 text-neutral-650">
          These terms apply to eBook purchases, publishing inquiries, and service
          requests made through {site.name}. By using this website, you agree to
          use it lawfully and provide accurate information when placing orders or
          submitting inquiries.
        </p>

        <div className="mt-10 grid gap-8 text-base leading-8 text-neutral-650">
          <PolicyBlock title="Digital Book Purchases">
            Paid eBooks are delivered through secure download links after payment
            verification. Download links are for the purchasing customer only and
            may not be resold, publicly shared, or redistributed.
          </PolicyBlock>
          <PolicyBlock title="Refunds">
            Because eBooks are digital products delivered after payment, completed
            purchases are generally non-refundable once the download link has
            been issued. If you paid in error, bought the wrong title, or cannot
            access your file, contact us promptly and we will review the issue
            fairly.
          </PolicyBlock>
          <PolicyBlock title="Publishing & Print Services">
            Publishing, sermon-to-book, and print requests are inquiries until a
            separate written agreement, invoice, or project scope is confirmed.
            Project timelines, deliverables, and payment terms may vary by
            service.
          </PolicyBlock>
          <PolicyBlock title="Support">
            For order support, download access, or refund review, contact us at{" "}
            <Link href="/contact" className="font-bold text-red-700 hover:text-red-800">
              the contact page
            </Link>
            .
          </PolicyBlock>
        </div>
      </div>
    </section>
  );
}

function PolicyBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-black text-neutral-950">{title}</h2>
      <p className="mt-3">{children}</p>
    </section>
  );
}
