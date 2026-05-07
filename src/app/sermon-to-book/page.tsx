import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { SermonBookInquiryForm } from "@/components/forms/SermonBookInquiryForm";
import { SectionHeader } from "@/components/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Sermon to Book",
  description:
    "Turn sermons, teaching series, retreats, and conference messages into lasting books and ministry resources.",
  path: "/sermon-to-book",
});

const formats = [
  {
    title: "Devotionals",
    text: "Short daily readings drawn from sermon themes, with scripture, reflection, and practical application.",
  },
  {
    title: "Study Guides",
    text: "Structured lessons for groups, discipleship classes, ministry teams, and personal study.",
  },
  {
    title: "Conference Booklets",
    text: "Focused resources that can be shared at conferences, retreats, church programs, and ministry outreaches.",
  },
  {
    title: "Teaching Manuals",
    text: "Organized teaching material for leaders, workers, schools of ministry, and recurring training programs.",
  },
  {
    title: "Full Books",
    text: "Complete books developed from sermon series, including chapters, transitions, examples, and reader takeaways.",
  },
  {
    title: "Discipleship Resources",
    text: "Practical materials that help believers revisit key truths, grow in doctrine, and apply what they have heard.",
  },
];

const workflow = [
  "Receive audio/video/transcript",
  "Transcribe and clean up",
  "Arrange into chapters",
  "Edit and expand",
  "Design cover and format",
  "Publish as eBook first",
  "Prepare for physical printing if needed",
];

const ministryBenefits = [
  {
    title: "Preserve teachings",
    text: "Keep important messages from being buried in archives, devices, or scattered notes.",
  },
  {
    title: "Reach more people",
    text: "Let the message serve people beyond the meeting room, the livestream, or the original event date.",
  },
  {
    title: "Create ministry resources",
    text: "Build books, guides, and manuals that support discipleship, training, retreats, and church programs.",
  },
  {
    title: "Generate book revenue for ministry work",
    text: "Use well-packaged books as a practical channel for sales that can support ministry projects and outreach.",
  },
];

export default function SermonToBookPage() {
  return (
    <>
      <section className="bg-neutral-950 px-6 py-20 text-white sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
              Sermon to Book
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Turn powerful sermons into lasting books.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
              Sermons should not end when the meeting ends. KD Global
              Publishing House helps ministers and ministries turn sermons,
              teaching series, retreats, and conference messages into books
              that can be read, studied, shared, and preserved.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
              Ministry publishing
            </p>
            <h2 className="mt-5 text-3xl font-black tracking-tight">
              From spoken message to written resource.
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-300">
              We help capture the heart of the message, remove unnecessary
              repetition, arrange the teaching, and package it for readers
              without stripping away its spiritual weight.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Possible formats"
            title="What sermons can become"
            description="One message, series, retreat, or conference can become multiple resources that continue teaching long after the original gathering."
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {formats.map((format) => (
              <article
                key={format.title}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div className="mb-5 h-1.5 w-14 rounded-full bg-red-700" />
                <h2 className="text-xl font-bold text-neutral-950">
                  {format.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-neutral-650">
                  {format.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Workflow"
            title="A practical process for turning messages into books."
            description="We can begin with raw audio, video, transcripts, outlines, or teaching notes, then move the material through a clear publishing process."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {workflow.map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-red-700 text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="self-center text-base font-semibold text-neutral-800">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              For ministries
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
              Build a library from the teaching already in the house.
            </h2>
            <p className="mt-5 text-base leading-8 text-neutral-650">
              Ministries often carry years of sermons, retreats, Bible studies,
              and conference messages. Those teachings can become credible
              resources that strengthen people and support the work.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ministryBenefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-5"
              >
                <h3 className="font-bold text-neutral-950">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-650">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            eyebrow="Project inquiry"
            title="Send the sermon archive or project idea."
            description="Use this form for sermons, retreats, teaching series, and conference messages that should become books or ministry resources."
          />
          <SermonBookInquiryForm />
        </div>
      </section>

      <CTASection
        title="Turn your next sermon series into a book."
        description="Send the message, transcript, outline, or project idea. KD Global Publishing House will help you identify the strongest format and begin the publishing process."
        primaryLabel="Contact Us"
        primaryHref="/contact"
      />
    </>
  );
}
