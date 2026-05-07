import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-lg font-black text-neutral-950">{site.name}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
            {site.description} We begin with eBooks and publishing support, with
            physical book ordering and print coordination planned for a later
            phase.
          </p>
        </div>
        <div>
          <p className="font-bold text-neutral-950">Useful Links</p>
          <div className="mt-4 grid gap-3 text-sm text-neutral-600">
            {site.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit transition hover:translate-x-1 hover:text-red-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold text-neutral-950">Contact</p>
          <div className="mt-4 grid gap-3 text-sm text-neutral-600">
            <p>{site.email}</p>
            <p>{site.phone}</p>
            <p>{site.address}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-neutral-200 pt-6 text-sm text-neutral-500">
        © {new Date().getFullYear()} {site.name}. A {site.parentBrand} brand.
      </div>
    </footer>
  );
}
