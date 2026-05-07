import type { AdminStat } from "@/types";

export function AdminStatCard({ stat }: { stat: AdminStat }) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-700">
        {stat.label}
      </p>
      <p className="mt-3 text-3xl font-black text-neutral-950">{stat.value}</p>
      <p className="mt-2 text-sm leading-7 text-neutral-650">{stat.note}</p>
    </article>
  );
}
