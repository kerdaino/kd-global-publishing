import Link from "next/link";
import { site } from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex w-fit items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-red-700 text-base font-black text-white">
            KD
          </span>
          <span>
            <span className="block text-base font-black tracking-tight text-neutral-950">
              KD Global
            </span>
            <span className="block text-sm font-medium text-neutral-500">
              Publishing House
            </span>
          </span>
        </Link>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 text-sm font-semibold text-neutral-700 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 lg:items-center lg:justify-end">
          {site.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.href === "/contact"
                  ? "whitespace-nowrap rounded-md bg-red-700 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-md"
                  : "whitespace-nowrap rounded-md px-3 py-2 transition hover:bg-neutral-100 hover:text-red-700"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
