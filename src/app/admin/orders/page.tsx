import type { Metadata } from "next";
import Link from "next/link";
import { updateOrderDeliveryStatus } from "@/app/admin/actions";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Orders" };

type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  amount: number;
  currency: string | null;
  paystack_reference: string;
  payment_status: string | null;
  delivery_status: string | null;
  created_at: string;
  books: { title: string } | null;
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const supabase = createAdminClient();
  let query = supabase
    .from("orders")
    .select("*, books(title)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("payment_status", status);
  }

  const { data } = await query;
  const orders = (data || []) as OrderRow[];

  return (
    <div>
      <h1 className="text-4xl font-black text-neutral-950">Order Management</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-650">
        View Paystack orders, customer details, references, and delivery status.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {["all", "paid", "pending"].map((item) => (
          <Link
            key={item}
            href={`/admin/orders?status=${item}`}
            className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-bold capitalize text-neutral-700 transition hover:border-red-700 hover:text-red-700"
          >
            {item}
          </Link>
        ))}
      </div>
      <AdminTable empty={!orders.length}>
        <thead>
          <tr>
            <AdminTh>Customer</AdminTh>
            <AdminTh>Book</AdminTh>
            <AdminTh>Amount</AdminTh>
            <AdminTh>Payment</AdminTh>
            <AdminTh>Reference</AdminTh>
            <AdminTh>Delivery</AdminTh>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <AdminTd>
                <p className="font-bold text-neutral-950">{order.customer_name}</p>
                <p>{order.customer_email}</p>
                <p>{order.customer_phone}</p>
              </AdminTd>
              <AdminTd>{order.books?.title || "Unknown book"}</AdminTd>
              <AdminTd>
                {order.currency || "NGN"} {Number(order.amount).toLocaleString("en-NG")}
              </AdminTd>
              <AdminTd>{order.payment_status}</AdminTd>
              <AdminTd>{order.paystack_reference}</AdminTd>
              <AdminTd>
                <form action={updateOrderDeliveryStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={order.id} />
                  <select
                    name="delivery_status"
                    defaultValue={order.delivery_status || "pending"}
                    className="rounded-md border border-neutral-300 px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="download_sent">Download sent</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button className="rounded-md bg-red-700 px-3 py-2 text-xs font-bold text-white">
                    Save
                  </button>
                </form>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}
