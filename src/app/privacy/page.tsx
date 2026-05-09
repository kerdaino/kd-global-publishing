import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How The Scribe House collects, uses, and protects customer and inquiry information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="bg-neutral-50 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Privacy
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-950">
          Privacy Policy
        </h1>
        <p className="mt-5 text-base leading-8 text-neutral-650">
          {site.name} collects only the information needed to respond to
          inquiries, process orders, verify payments, and deliver digital
          products.
        </p>

        <div className="mt-10 grid gap-8 text-base leading-8 text-neutral-650">
          <PolicyBlock title="Information We Collect">
            We may collect your name, email address, phone or WhatsApp number,
            order details, payment reference, and messages submitted through our
            forms.
          </PolicyBlock>
          <PolicyBlock title="How We Use Information">
            We use your information to process purchases, provide secure download
            access, respond to publishing and print inquiries, send order
            notifications, and maintain basic admin records.
          </PolicyBlock>
          <PolicyBlock title="Payment & Storage Providers">
            To operate our bookstore and publishing services, we may use trusted third-party 
            providers for payment processing, secure file storage, order management, 
            and email communication. These providers may include Paystack, and Others.
          </PolicyBlock>
          <PolicyBlock title="Your Choices">
            You can contact us to request correction or removal of inquiry
            information where legally and operationally appropriate. Order and
            payment records may need to be retained for accounting, access, and
            fraud-prevention purposes.
          </PolicyBlock>
          <PolicyBlock title="Contact">
            For privacy questions, reach us through{" "}
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
