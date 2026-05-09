export const site = {
  name: "KD Global Publishing House",
  parentBrand: "KD Global",
  portfolioUrl: "https://www.kdevglobal.com",
  description:
    "A Christian publishing house serving authors, ministers, and ministries with thoughtful book development and eBook publishing.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "",
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
