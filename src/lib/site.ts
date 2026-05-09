const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";

export const site = {
  name: "KD Global Publishing House",
  parentBrand: "KD Global",
  portfolioUrl: "https://www.kdevglobal.com",
  description:
    "A Christian publishing house serving authors, ministers, and ministries with thoughtful book development and eBook publishing.",
  email: contactEmail.includes("@") ? contactEmail : "",
  phone: "+2347011780857",
  phoneHref: "tel:+2347011780857",
  whatsappUrl: "https://wa.me/2347011780857",
  address: "Lagos, Nigeria",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Bookstore", href: "/bookstore" },
    { label: "Authors", href: "/authors" },
    { label: "Publishing Services", href: "/publishing-services" },
    { label: "Sermon to Book", href: "/sermon-to-book" },
    { label: "Print Request", href: "/print-request" },
    { label: "Contact", href: "/contact" },
  ],
};
