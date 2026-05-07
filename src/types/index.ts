export type BookStatus = "Available" | "Available Soon" | "Coming Soon";

export type BookFormat = "eBook PDF" | "Print" | "eBook PDF + Print";

export type Book = {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  author: string;
  authorSlug: string;
  category: string;
  price: string;
  priceInKobo: number;
  coverImage: string;
  sampleFileUrl?: string;
  shortDescription: string;
  description: string;
  whatReadersWillLearn: string[];
  format: BookFormat;
  status: BookStatus;
  isPhysicalAvailable?: boolean;
  // Add a Paystack Payment Page URL here later, or replace this field with
  // server-generated checkout links when Paystack API integration is added.
  paymentLink: string;
  downloadFilePath?: string;
};

export type Author = {
  name: string;
  slug: string;
  role: string;
  bio: string;
  image: string;
};

export type InquiryType = "publishing" | "sermon-book" | "print-request";

export type AdminStat = {
  label: string;
  value: string;
  note: string;
};

export type ApiResult<T = unknown> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string };
