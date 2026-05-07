import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";

const adminLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Books", href: "/admin/books" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Sermon Projects", href: "/admin/sermon-projects" },
  { label: "Print Requests", href: "/admin/print-requests" },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-lg border border-neutral-200 bg-neutral-950 p-4 text-white lg:sticky lg:top-28">
      <p className="px-3 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
        Admin
      </p>
      <nav className="mt-2 grid gap-1">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm font-semibold text-neutral-200 transition hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <form action={logoutAdmin} className="mt-4 border-t border-white/10 pt-4">
        <button
          type="submit"
          className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-neutral-300 transition hover:bg-white/10 hover:text-white"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
