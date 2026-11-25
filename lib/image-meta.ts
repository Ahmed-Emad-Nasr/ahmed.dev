/*
 * ═══ lib/image-meta.ts — the size of an image, and its ImageObject ═══
 *
 * Server only (reads public/ at build time): import it from page.tsx files.
 *
 *   imageSize("Assets/gallery/x.webp")  → { width, height } read from the
 *       file's header, so pages reserve the right space (no jump while loading)
 *       and the structured data states the real size.
 *   imageObject({...})                  → the schema.org ImageObject Google
 *       Images reads: caption, creator, credit, copyright, licence, where it
 *       was taken, and the page it belongs to.
 *
 * The same details are written into the image files themselves by
 * scripts/tag-images.mjs (XMP / IPTC / EXIF).
 */

import { openSync, readSync, closeSync, existsSync } from "node:fs";
import { join } from "node:path";
import { absoluteUrl } from "@/lib/site";
import { PERSON_REF } from "@/lib/seo";
import { REPO_URL } from "@/lib/shared";

type ImageSize = { width: number; height: number };

/** Width and height from a WebP/PNG/JPEG header (only the first bytes are read) */
export function imageSize(publicPath: string): ImageSize | undefined {
  const file = join(process.cwd(), "public", publicPath.replace(/^\/+/, ""));
  if (!existsSync(file)) return undefined;
  const fd = openSync(file, "r");
  const buf = Buffer.alloc(64 * 1024);
  readSync(fd, buf, 0, buf.length, 0);
  closeSync(fd);

  /* WebP: RIFF....WEBP + VP8X / VP8 / VP8L */
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
  }
  /* PNG */
  if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  /* JPEG: walk the markers to the first SOFn */
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) break;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  return undefined;
}

/** The content licence: the photos and scans are © Ahmed Emad Nasr (CONTENT-LICENSE.md) */
const CONTENT_LICENSE_URL = `${REPO_URL}/blob/master/CONTENT-LICENSE.md`;
/** Where to ask for permission to reuse an image */
const ACQUIRE_LICENSE_URL = absoluteUrl("/#contact");

type ImageObjectInput = {
  id: string;
  /** Path under public/ ("Assets/gallery/x.webp") */
  src: string;
  thumb?: string;
  name: string;
  caption: string;
  description?: string;
  /** The page the image belongs to (absolute) */
  pageUrl: string;
  keywords?: readonly string[];
  /** Who made it: an organisation's name (a certificate), or the person */
  creatorName?: string;
  date?: string;
  place?: string;
  copyrightNotice: string;
  size?: ImageSize;
};

export function imageObject(i: ImageObjectInput) {
  const size = i.size ?? imageSize(i.src);
  return {
    "@type": "ImageObject",
    "@id": i.id,
    contentUrl: absoluteUrl(i.src),
    url: absoluteUrl(i.src),
    ...(i.thumb ? { thumbnailUrl: absoluteUrl(i.thumb) } : {}),
    name: i.name,
    caption: i.caption,
    ...(i.description ? { description: i.description } : {}),
    ...(i.keywords?.length ? { keywords: i.keywords.join(", ") } : {}),
    ...(size ? { width: size.width, height: size.height } : {}),
    encodingFormat: "image/webp",
    mainEntityOfPage: i.pageUrl,
    about: PERSON_REF,
    creator: i.creatorName ? { "@type": "Organization", name: i.creatorName } : PERSON_REF,
    creditText: "Ahmed Emad Nasr",
    copyrightHolder: PERSON_REF,
    copyrightNotice: i.copyrightNotice,
    license: CONTENT_LICENSE_URL,
    acquireLicensePage: ACQUIRE_LICENSE_URL,
    ...(i.date ? { dateCreated: i.date } : {}),
    ...(i.place ? { contentLocation: { "@type": "Place", name: i.place } } : {}),
    representativeOfPage: false,
  };
}
