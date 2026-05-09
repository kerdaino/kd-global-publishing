"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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
    <header className="sticky top-0 z-50 w-full overflow-hidden border-b border-neutral-200 bg-white/95 shadow-sm shadow-neutral-950/5 backdrop-blur dark:border-[#5a514b] dark:bg-[#29231f]/95">
      <nav
        className="mx-auto w-full max-w-7xl min-w-0 overflow-hidden px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <div className="flex min-h-20 min-w-0 items-center justify-between gap-3 sm:gap-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="min-w-0 max-w-[calc(100%-3.5rem)] overflow-hidden rounded-md xl:max-w-none"
            aria-label={site.name}
          >
            <Logo shortText="Publishing House" />
          </Link>

          <div className="hidden min-w-0 items-center justify-end gap-1 text-sm font-semibold text-neutral-700 dark:text-[#eadfd6] xl:flex">
            {site.navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActiveRoute(pathname, link.href)}
              />
            ))}
            <ThemeToggle className="ml-2" />
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-neutral-300 text-neutral-950 transition hover:border-red-700 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 xl:hidden"
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
              ? "grid min-w-0 overflow-hidden border-t border-neutral-200 py-4 xl:hidden"
              : "hidden"
          }
        >
          <Link
            href="/"
            onClick={closeMenu}
            className="mb-4 min-w-0 overflow-hidden rounded-md"
            aria-label={site.name}
          >
            <Logo shortText="Publishing House" />
          </Link>
          <div className="grid min-w-0 gap-2 text-sm font-semibold text-neutral-800 dark:text-[#eadfd6]">
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
          <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-[#5a514b]">
            <ThemeToggle />
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
            ? "whitespace-nowrap rounded-md bg-red-800 px-4 py-2 text-white shadow-sm ring-2 ring-red-200 transition duration-200 hover:-translate-y-0.5 hover:bg-red-900 hover:shadow-md dark:bg-[#7e3b34] dark:ring-[#ef8f82]/30 dark:hover:bg-[#91483f]"
            : "whitespace-nowrap rounded-md bg-red-700 px-4 py-2 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-md dark:bg-[#a84d43] dark:hover:bg-[#91483f]"
          : active
            ? "whitespace-nowrap border-b-2 border-red-700 px-3 py-2 text-red-700 transition duration-200 hover:bg-red-50 dark:border-[#ef8f82] dark:text-[#ffd0c6] dark:hover:bg-[#452b27]"
            : "whitespace-nowrap rounded-md border-b-2 border-transparent px-3 py-2 transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 hover:text-red-700 dark:text-[#eadfd6] dark:hover:bg-white/10 dark:hover:text-[#ffd0c6]"
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
            ? "flex min-h-12 items-center rounded-md bg-red-800 px-4 text-white shadow-sm transition duration-200 hover:bg-red-900 dark:bg-[#7e3b34] dark:hover:bg-[#91483f]"
            : "flex min-h-12 items-center rounded-md bg-red-700 px-4 text-white transition duration-200 hover:bg-red-800 dark:bg-[#a84d43] dark:hover:bg-[#91483f]"
          : active
            ? "flex min-h-12 items-center rounded-md border-l-4 border-red-700 bg-red-50 px-4 text-red-700 transition duration-200 dark:border-[#ef8f82] dark:bg-[#452b27] dark:text-[#ffd0c6]"
            : "flex min-h-12 items-center rounded-md border-l-4 border-transparent px-4 transition duration-200 hover:border-red-200 hover:bg-neutral-100 hover:text-red-700 dark:text-[#eadfd6] dark:hover:border-[#6d332f] dark:hover:bg-white/10 dark:hover:text-[#ffd0c6]"
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
