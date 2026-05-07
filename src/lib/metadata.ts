import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getBaseUrl } from "@/lib/utils";

type PageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function createPageMetadata({
  title,
  description,
  path = "/",
  image = "/og-image",
}: PageMetadataInput): Metadata {
  const url = `${getBaseUrl()}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [image],
    },
  };
}
