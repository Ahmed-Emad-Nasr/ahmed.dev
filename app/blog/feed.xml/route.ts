/*
 * ═══ /blog/feed.xml — the RSS feed of the case library ═══
 *
 * One entry per case, newest first, so a reader (or a recruiter's feed
 * reader) is told when a new case is published. Written at build time into
 * out/blog/feed.xml; browsers and readers find it through the
 * <link rel="alternate" type="application/rss+xml"> in the head of /blog
 * (metadata.alternates.types in app/blog/page.tsx).
 * Nothing to edit: it follows data/cases.ts.
 */

import { caseEvidenceLibrary } from "@/data/cases";
import { PROFILE } from "@/data/profile";
import { absoluteUrl, caseUrl, summarize } from "@/lib/site";

/* Required by the static export (see the same line in app/manifest.ts) */
export const dynamic = "force-static";

const escapeXml = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const time = (date?: string): number => {
  const t = date ? new Date(date).getTime() : NaN;
  return Number.isNaN(t) ? 0 : t;
};

export function GET(): Response {
  const items = [...caseEvidenceLibrary].sort((a, b) => time(b.date) - time(a.date));
  const feedUrl = absoluteUrl("/blog/feed.xml");
  const updated = new Date(time(items[0]?.date) || Date.now()).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${PROFILE.name} — Case Library`)}</title>
    <link>${absoluteUrl("/blog")}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Incident investigations, DFIR and malware analysis reports, labs and detection notes.</description>
    <language>en</language>
    <lastBuildDate>${updated}</lastBuildDate>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${caseUrl(item.id)}</link>
      <guid isPermaLink="true">${caseUrl(item.id)}</guid>
      ${time(item.date) ? `<pubDate>${new Date(time(item.date)).toUTCString()}</pubDate>` : ""}
      <category>${escapeXml(item.category)}</category>
      <description>${escapeXml(summarize(item.description, 300))}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
