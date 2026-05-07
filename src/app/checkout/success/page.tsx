import type { Metadata } from "next";
import { CheckoutVerifier } from "@/components/checkout/CheckoutVerifier";

export const metadata: Metadata = {
  title: "Checkout Successful",
  description: "Verify a successful KD Global Publishing House book payment.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  return (
    <section className="bg-neutral-50 px-6 py-20">
      <CheckoutVerifier reference={reference} />
    </section>
  );
}
