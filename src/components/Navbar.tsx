"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";

const mobileNavLinks = [...site.navLinks, { label: "Admin", href: "/admin" }];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-sm shadow-neutral-950/5 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6" aria-label="Main navigation">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link href="/" onClick={closeMenu} className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-red-700 text-base font-black text-white">
              KD
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight text-neutral-950">
                KD Global
              </span>
              <span className="block truncate text-sm font-medium text-neutral-500">
                Publishing House
              </span>
            </span>
          </Link>

          <div className="hidden items-center justify-end gap-1 text-sm font-semibold text-neutral-700 lg:flex">
            {site.navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-neutral-300 text-neutral-950 transition hover:border-red-700 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 lg:hidden"
          >
            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
            <span className="grid gap-1.5">
              <span
                className={
                  isOpen
                    ? "block h-0.5 w-5 translate-y-2 rotate-45 rounded-full bg-current transition"
                    : "block h-0.5 w-5 rounded-full bg-current transition"
                }
              />
              <span
                className={
                  isOpen
                    ? "block h-0.5 w-5 opacity-0 transition"
                    : "block h-0.5 w-5 rounded-full bg-current transition"
                }
              />
              <span
                className={
                  isOpen
                    ? "block h-0.5 w-5 -translate-y-2 -rotate-45 rounded-full bg-current transition"
                    : "block h-0.5 w-5 rounded-full bg-current transition"
                }
              />
            </span>
          </button>
        </div>

        <div
          id="mobile-navigation"
          className={
            isOpen
              ? "grid border-t border-neutral-200 py-4 lg:hidden"
              : "hidden"
          }
        >
          <div className="grid gap-2 text-sm font-semibold text-neutral-800">
            {mobileNavLinks.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                onClick={closeMenu}
              />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={
        href === "/contact"
          ? "whitespace-nowrap rounded-md bg-red-700 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-md"
          : "whitespace-nowrap rounded-md px-3 py-2 transition hover:bg-neutral-100 hover:text-red-700"
      }
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        href === "/contact"
          ? "flex min-h-12 items-center rounded-md bg-red-700 px-4 text-white transition hover:bg-red-800"
          : "flex min-h-12 items-center rounded-md px-4 transition hover:bg-neutral-100 hover:text-red-700"
      }
    >
      {label}
    </Link>
  );
}
