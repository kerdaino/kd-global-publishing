import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminOrderActions } from "@/components/admin/AdminOrderActions";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Order Detail" };

type OrderDetail = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  amount: number;
  amount_paid: number | null;
  paystack_fee: number | null;
  currency: string | null;
  paystack_reference: string;
  payment_status: string | null;
  delivery_status: string | null;
  created_at: string;
  paid_at: string | null;
  books: {
    title: string;
    slug: string;
    ebook_file_path: string | null;
  } | null;
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, books(title, slug, ebook_file_path)")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const order = data as OrderDetail;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm font-bold text-red-700 transition hover:text-red-800"
      >
        Back to orders
      </Link>
      <h1 className="mt-4 text-4xl font-black text-neutral-950">Order Detail</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-650">
        Review order, customer, payment, and support actions.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-neutral-950">Order</h2>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <Detail label="Book" value={order.books?.title || "Unknown book"} />
            <Detail label="Expected amount" value={formatMoney(order.amount, order.currency)} />
            <Detail label="Amount paid" value={formatMoney(order.amount_paid, order.currency)} />
            <Detail label="Fee amount" value={formatMoney(order.paystack_fee, order.currency)} />
            <Detail label="Payment status" value={order.payment_status || "Unknown"} />
            <Detail label="Delivery status" value={order.delivery_status || "Pending"} />
            <Detail label="Paystack reference" value={order.paystack_reference} />
            <Detail label="Created" value={formatDate(order.created_at)} />
            <Detail label="Paid" value={order.paid_at ? formatDate(order.paid_at) : "Not paid"} />
            <Detail label="eBook file" value={order.books?.ebook_file_path || "No private file path saved"} />
          </dl>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-neutral-950">Customer</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            <Detail label="Name" value={order.customer_name} />
            <Detail label="Email" value={order.customer_email} />
            <Detail label="Phone" value={order.customer_phone || "Not provided"} />
          </dl>
          <div className="mt-6 border-t border-neutral-200 pt-5">
            <h3 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-neutral-500">
              Support actions
            </h3>
            <AdminOrderActions orderId={order.id} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-neutral-50 p-4">
      <dt className="text-xs font-black uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </dt>
      <dd className="mt-2 break-words font-bold text-neutral-950">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(amount: number | null | undefined, currency: string | null) {
  if (amount === null || amount === undefined) {
    return "Not recorded";
  }

  return `${currency || "NGN"} ${Number(amount).toLocaleString("en-NG")}`;
}
