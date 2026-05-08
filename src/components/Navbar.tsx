"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

const mobileNavLinks = site.navLinks;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-sm shadow-neutral-950/5 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6" aria-label="Main navigation">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link href="/" onClick={closeMenu} className="rounded-md" aria-label={site.name}>
            <Logo />
          </Link>

          <div className="hidden items-center justify-end gap-1 text-sm font-semibold text-neutral-700 lg:flex">
            {site.navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActiveRoute(pathname, link.href)}
              />
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
          role="region"
          aria-label="Mobile navigation"
          className={
            isOpen
              ? "grid border-t border-neutral-200 py-4 lg:hidden"
              : "hidden"
          }
        >
          <Link href="/" onClick={closeMenu} className="mb-4 rounded-md" aria-label={site.name}>
            <Logo />
          </Link>
          <div className="grid gap-2 text-sm font-semibold text-neutral-800">
            {mobileNavLinks.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActiveRoute(pathname, link.href)}
                onClick={closeMenu}
              />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const isContact = href === "/contact";

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        isContact
          ? active
            ? "whitespace-nowrap rounded-md bg-red-800 px-4 py-2 text-white shadow-sm ring-2 ring-red-200 transition duration-200 hover:-translate-y-0.5 hover:bg-red-900 hover:shadow-md"
            : "whitespace-nowrap rounded-md bg-red-700 px-4 py-2 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-md"
          : active
            ? "whitespace-nowrap border-b-2 border-red-700 px-3 py-2 text-red-700 transition duration-200 hover:bg-red-50"
            : "whitespace-nowrap rounded-md border-b-2 border-transparent px-3 py-2 transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 hover:text-red-700"
      }
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const isContact = href === "/contact";

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={
        isContact
          ? active
            ? "flex min-h-12 items-center rounded-md bg-red-800 px-4 text-white shadow-sm transition duration-200 hover:bg-red-900"
            : "flex min-h-12 items-center rounded-md bg-red-700 px-4 text-white transition duration-200 hover:bg-red-800"
          : active
            ? "flex min-h-12 items-center rounded-md border-l-4 border-red-700 bg-red-50 px-4 text-red-700 transition duration-200"
            : "flex min-h-12 items-center rounded-md border-l-4 border-transparent px-4 transition duration-200 hover:border-red-200 hover:bg-neutral-100 hover:text-red-700"
      }
    >
      {label}
    </Link>
  );
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/bookstore" && pathname.startsWith("/books/")) {
    return true;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
