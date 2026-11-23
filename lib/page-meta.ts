/*
 * ═══ lib/page-meta.ts — the <head> tags of a page, in one call ═══
 *
 * pageMetadata({ title, description, path, keywords, share }) returns the
 * title, description, keywords, canonical link and the share-card tags
 * (Open Graph + X/Twitter) every page needs, so a new page is one call.
 *
 *   title       → the full title; it already carries the name, so the
 *                 " | Ahmed Emad Nasr" template is not added
 *   path        → the page's address without the base path: "/training"
 *   share       → pageShareImage(...) from lib/og.ts
 */

import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import type { ShareImage } from "@/lib/og";
import { X_HANDLE } from "@/lib/shared";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  share: ShareImage;
  type?: "website" | "article";
};

export function pageMetadata({ title, description, path, keywords, share, type = "website" }: PageMeta): Metadata {
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type,
      siteName: "Ahmed Emad Nasr",
      locale: "en_US",
      images: [share],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: X_HANDLE,
      creator: X_HANDLE,
      images: [{ url: share.url, alt: share.alt }],
    },
  };
}
