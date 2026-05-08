import type { Metadata } from "next";
import { PrintRequestForm } from "@/components/forms/PrintRequestForm";
import { SectionHeader } from "@/components/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Print Request",
  description: "Request physical book printing and production support.",
  path: "/print-request",
});

export default function PrintRequestPage() {
  return (
    <section className="bg-neutral-50 px-6 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeader
            headingLevel="h1"
            eyebrow="Physical Books"
            title="Plan print production with care."
            description="KD Global Publishing House supports physical book ordering, print coordination, and production support for authors and ministries."
          />
          <div className="mt-8 grid gap-4">
            {["Print-ready files", "Quantity planning", "Production coordination"].map((item) => (
              <div key={item} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="font-bold text-neutral-950">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <PrintRequestForm />
      </div>
    </section>
  );
}
