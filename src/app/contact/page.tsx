import type { Metadata } from "next";
import Link from "next/link";
import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";
import { SectionHeader } from "@/components/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Send an inquiry to KD Global Publishing House about eBooks, publishing services, or sermon-to-book projects.",
  path: "/contact",
});

const contactCards = [
  {
    title: "Book orders",
    text: "Ask about available eBooks, coming soon titles, payment links, and how to receive your copy.",
    href: "/bookstore",
  },
  {
    title: "Publishing inquiries",
    text: "Share your manuscript, book idea, or publishing need so we can help identify the right next step.",
    href: "/publishing-services",
  },
  {
    title: "Sermon-to-book projects",
    text: "Discuss sermons, teaching series, retreats, and conference messages that should become written resources.",
    href: "/sermon-to-book",
  },
  {
    title: "Print request",
    text: "Request support for future physical copies, print-ready preparation, and production coordination.",
    href: "/print-request",
  },
];

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;

  return (
    <section className="bg-neutral-50 px-6 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeader
            eyebrow="Publishing Inquiry"
            title="Start a conversation about your book or message."
            description="Use this page for book orders, publishing support, sermon-to-book projects, and future physical printing inquiries."
            headingLevel="h1"
          />
          <div className="mt-8 grid gap-4">
            {contactCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
              >
                <div className="mb-4 h-1.5 w-12 rounded-full bg-red-700" />
                <h2 className="font-bold text-neutral-950">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-neutral-650">
                  {card.text}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-neutral-950 p-6 text-sm leading-7 text-neutral-300 shadow-sm">
            <p className="font-bold text-white">Contact details</p>
            <p className="mt-4 text-white">{site.email}</p>
            <p>{site.phone}</p>
            <p>{site.address}</p>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
            >
              Chat on WhatsApp
            </Link>
          </div>
        </div>

        <ContactInquiryForm />
      </div>
    </section>
  );
}
