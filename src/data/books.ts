import type { Book } from "@/types";

export type { Book };

export const books: Book[] = [
  {
    title: "Mum’s First Book",
    slug: "mums-first-book",
    subtitle: "A Christian living title in preparation",
    author: "KD Global Author",
    authorSlug: "to-be-updated",
    category: "Christian Living",
    price: "₦5,000",
    priceInKobo: 500000,
    coverImage: "/book-covers/mums-first-book.jpg",
    sampleFileUrl: "",
    shortDescription:
      "A forthcoming Christian living eBook from KD Global Publishing House, prepared to encourage faith, growth, and daily devotion.",
    description:
      "Mum’s First Book is the first featured release planned for KD Global Publishing House. The final title, author details, and full manuscript description will be updated as the book is prepared for launch.",
    whatReadersWillLearn: [
      "How to grow in faith with practical Christian encouragement.",
      "How to apply biblical wisdom to everyday decisions.",
      "How to build a steady devotional life.",
      "How to remain hopeful and grounded through different seasons.",
    ],
    format: "eBook PDF",
    status: "Available Soon",
    isPhysicalAvailable: false,
    paymentLink: "",
    downloadFilePath: "ebooks/mums-first-book.pdf",
  },
  {
    title: "Sermon Book Series",
    slug: "sermon-book-series",
    subtitle: "Sermons shaped into lasting written resources",
    author: "KD Global Publishing House",
    authorSlug: "kd-global-publishing-house",
    category: "Sermon to Book",
    price: "Price to be announced",
    priceInKobo: 0,
    coverImage: "/book-covers/sermon-book-series.jpg",
    sampleFileUrl: "",
    shortDescription:
      "An upcoming series shaped from sermon messages into clear, readable Christian teaching resources.",
    description:
      "Sermon Book Series is planned for titles developed from sermons, ministry teachings, and message archives. Each book will be arranged to help readers study, reflect, and apply the message beyond the original service.",
    whatReadersWillLearn: [
      "How sermon themes can become structured Christian teaching.",
      "How to reflect on scripture through chapter-based study.",
      "How to connect preached messages to practical spiritual growth.",
      "How to revisit key ministry teachings in written form.",
    ],
    format: "eBook PDF",
    status: "Available Soon",
    isPhysicalAvailable: false,
    paymentLink: "",
  },
  {
    title: "Devotional Teaching Series",
    slug: "devotional-teaching-series",
    subtitle: "Short teachings for devotion and growth",
    author: "KD Global Publishing House",
    authorSlug: "kd-global-publishing-house",
    category: "Devotional",
    price: "Price to be announced",
    priceInKobo: 0,
    coverImage: "/book-covers/devotional-teaching-series.jpg",
    sampleFileUrl: "",
    shortDescription:
      "A planned devotional teaching series with short readings for reflection, prayer, and steady Christian growth.",
    description:
      "Devotional Teaching Series is an upcoming collection designed for readers who want concise, faith-building lessons. The content is shaped into devotional entries with scripture focus, reflection, and practical application.",
    whatReadersWillLearn: [
      "How to meditate on spiritual truth in a simple daily rhythm.",
      "How to turn teaching notes into personal devotion.",
      "How to grow through reflection, prayer, and action.",
      "How to build consistency in Christian learning.",
    ],
    format: "eBook PDF",
    status: "Available Soon",
    isPhysicalAvailable: false,
    paymentLink: "",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}
