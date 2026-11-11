/*
 * ═══ /.well-known/security.txt (RFC 9116) ═══
 *
 * The standard file security researchers look for: where to report a
 * vulnerability in this site, and until when this information is valid.
 * Written at build time into out/.well-known/security.txt.
 *
 * Note: tools only read it at the ROOT of a domain. While the site lives
 * under /ahmed.dev on github.io it is served at
 * /ahmed.dev/.well-known/security.txt (and linked from the footer); on a
 * custom domain it works as the standard expects, with no change.
 *
 * Expires: RFC 9116 wants a date less than a year away. It is set to 364
 * days after the build, and the deploy workflow rebuilds the site every
 * month (.github/workflows/nextjs.yml), so it never lapses.
 *
 * PGP: the "Encryption" line appears on its own once
 * PROFILE.contact.pgpFingerprint is filled in (data/profile.ts) and the
 * public key is at public/pgp-key.asc — steps in SECURITY.md.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { PROFILE } from "@/data/profile";
import { absoluteUrl } from "@/lib/site";
import { PGP_KEY_FILE, REPO_URL } from "@/lib/shared";

/* Required by the static export (see the same line in app/manifest.ts) */
export const dynamic = "force-static";

const DAY = 24 * 60 * 60 * 1000;

export function GET(): Response {
  const { email, pgpFingerprint } = PROFILE.contact;

  /* A fingerprint without the key file would publish a dead link */
  if (pgpFingerprint && !existsSync(join(process.cwd(), "public", PGP_KEY_FILE))) {
    throw new Error(`PROFILE.contact.pgpFingerprint is set but public/${PGP_KEY_FILE} is missing — see SECURITY.md`);
  }

  const lines = [
    "# Security contact for this site — RFC 9116",
    `Contact: mailto:${email}`,
    `Contact: ${absoluteUrl("/#contact")}`,
    `Expires: ${new Date(Date.now() + 364 * DAY).toISOString().replace(/\.\d{3}Z$/, "Z")}`,
    ...(pgpFingerprint ? [`Encryption: ${absoluteUrl(`/${PGP_KEY_FILE}`)}`] : []),
    "Preferred-Languages: en, ar",
    `Canonical: ${absoluteUrl("/.well-known/security.txt")}`,
    `Policy: ${REPO_URL}/blob/master/SECURITY.md`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
