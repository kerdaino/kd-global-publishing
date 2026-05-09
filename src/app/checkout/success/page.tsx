import type { Metadata } from "next";
import { CheckoutVerifier } from "@/components/checkout/CheckoutVerifier";

export const metadata: Metadata = {
  title: "Checkout Successful",
  description: "Verify a successful The Scribe House book payment.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const reference = firstParam(params.reference) || firstParam(params.trxref);

  return (
    <section className="bg-neutral-50 px-6 py-20">
      <CheckoutVerifier reference={reference} />
    </section>
  );
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
