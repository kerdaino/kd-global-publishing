export type BookStatus = "Available";

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
  sampleFilePath?: string;
  shortDescription: string;
  description: string;
  whatReadersWillLearn: string[];
  format: BookFormat;
  status: BookStatus;
  isPhysicalAvailable?: boolean;
  paymentLink: string;
  downloadFilePath?: string;
};

export type Author = {
  id?: string;
  name: string;
  slug: string;
  roleTitle: string;
  bio: string;
  image: string;
  email?: string;
  ministryName?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  xUrl?: string;
  linkedinUrl?: string;
  status?: "active" | "hidden";
  createdAt?: string;
  updatedAt?: string;
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
