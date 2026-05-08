import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const whatsappNumber = site.whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="border-t border-neutral-200 bg-white px-6 py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_1fr] lg:gap-12">
        <div>
          <p className="text-lg font-black text-neutral-950">{site.name}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
            {site.description} We support eBook publishing, book development,
            manuscript preparation, and print-ready production planning.
          </p>
        </div>
        <div>
          <p className="font-bold text-neutral-950">Useful Links</p>
          <div className="mt-4 grid gap-3 text-sm text-neutral-600">
            {site.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit rounded-sm transition duration-200 hover:translate-x-1 hover:text-red-700 focus-visible:text-red-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold text-neutral-950">Contact</p>
          <div className="mt-4 grid gap-3 text-sm text-neutral-600">
            <Link href={`mailto:${site.email}`} className="w-fit rounded-sm transition duration-200 hover:text-red-700 focus-visible:text-red-700">
              {site.email}
            </Link>
            {site.phone ? <p>{site.phone}</p> : null}
            <p>{site.address}</p>
            {whatsappNumber ? (
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
              >
                Chat on WhatsApp
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-5 border-t border-neutral-200 pt-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <p className="leading-7">
          © {new Date().getFullYear()} {site.name}. Built by{" "}
          <Link
            href="https://www.kdevglobal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm font-bold text-neutral-700 transition duration-200 hover:text-red-700 focus-visible:text-red-700"
          >
            KD Global
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <Link href="/terms" className="rounded-sm transition duration-200 hover:text-red-700 focus-visible:text-red-700">
            Terms
          </Link>
          <Link href="/terms#refund-policy" className="rounded-sm transition duration-200 hover:text-red-700 focus-visible:text-red-700">
            Refund Policy
          </Link>
          <Link href="/privacy" className="rounded-sm transition duration-200 hover:text-red-700 focus-visible:text-red-700">
            Privacy Policy
          </Link>
          <Link
            href="/admin/login"
            className="rounded-sm text-neutral-400 transition duration-200 hover:text-red-700 focus-visible:text-red-700"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
