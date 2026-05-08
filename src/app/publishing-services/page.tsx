import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { PublishingInquiryForm } from "@/components/forms/PublishingInquiryForm";
import { SectionHeader } from "@/components/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Publishing Services",
  description:
    "Editing, expansion, structuring, formatting, cover design direction, eBook publishing, and print preparation for Christian authors, ministers, and ministries.",
  path: "/publishing-services",
});

const services = [
  {
    title: "Manuscript editing",
    text: "We refine grammar, clarity, flow, tone, and consistency so the message reads with strength and care.",
  },
  {
    title: "Book expansion and rewriting support",
    text: "We help develop short drafts, outlines, teachings, and testimonies into fuller chapters without losing the author’s voice.",
  },
  {
    title: "Book arrangement and chapter structuring",
    text: "We organize ideas into a clear table of contents, chapter flow, section breaks, and reader-friendly progression.",
  },
  {
    title: "eBook formatting",
    text: "We prepare clean digital layouts with front matter, headings, spacing, and structure suitable for PDF eBook release.",
  },
  {
    title: "Cover design direction",
    text: "We guide cover concepts, title treatment, visual tone, and presentation so the book feels credible and well packaged.",
  },
  {
    title: "Publishing launch support",
    text: "We prepare sales descriptions, author notes, launch positioning, and next steps for digital sales and promotion.",
  },
  {
    title: "Print-ready preparation",
    text: "We plan the manuscript and files for physical book ordering, print coordination, and production requirements.",
  },
  {
    title: "Author/ministry publishing consultation",
    text: "We help authors, ministers, and ministries decide what to publish first, how to package it, and how to serve readers well.",
  },
];

const process = [
  {
    title: "Submit your idea/manuscript",
    text: "Send the book idea, draft, sermon series, teaching notes, or existing manuscript so we can understand the message and audience.",
  },
  {
    title: "We review and structure",
    text: "We assess the material, clarify the publishing goal, and shape a structure that can become a strong book.",
  },
  {
    title: "We edit and package",
    text: "We refine the content, strengthen the flow, format the eBook, and guide the cover and presentation direction.",
  },
  {
    title: "We publish and prepare for sales",
    text: "We prepare the book for digital release, sales copy, payment readiness, and print preparation where needed.",
  },
];

export default function PublishingServicesPage() {
  return (
    <>
      <section className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
              Publishing Services
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-neutral-950 sm:text-6xl">
              From manuscript to market-ready book.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-650">
              KD Global Publishing House helps Christian authors, ministers,
              and ministries with editing, expansion, structuring, formatting,
              cover design, eBook publishing, and print preparation.
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-950 p-6 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
              Built for message-driven books
            </p>
            <h2 className="mt-5 text-3xl font-black tracking-tight">
              We help preserve the message and polish the vessel.
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-300">
              A strong Christian book needs more than words on a page. It needs
              structure, editorial care, thoughtful presentation, and a clear
              path to readers.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Services"
            title="Practical publishing support for every stage of the book."
            description="Choose one service or request full publishing support. We can meet the project where it is and help move it toward a finished, reader-ready book."
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 h-1.5 w-14 rounded-full bg-red-700" />
                <h2 className="text-xl font-bold text-neutral-950">
                  {service.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-neutral-650">
                  {service.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              Process
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
              A clear path from raw material to finished book.
            </h2>
            <p className="mt-5 text-base leading-8 text-neutral-650">
              The process is simple enough to begin, but serious enough to
              produce work that can represent the author, ministry, and message
              well.
            </p>
          </div>
          <div className="grid gap-4">
            {process.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-red-700 text-sm font-black text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-neutral-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-650">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            eyebrow="Start here"
            title="Tell us about the book you want to publish."
            description="This inquiry form is ready for Supabase storage and Resend notifications through the API route."
          />
          <PublishingInquiryForm />
        </div>
      </section>

      <CTASection
        title="Start a publishing project"
        description="Whether you have a manuscript, a sermon series, a teaching outline, or only the seed of a book idea, KD Global Publishing House can help you take the next step."
        primaryLabel="Start a Publishing Project"
        primaryHref="/contact"
      />
    </>
  );
}
