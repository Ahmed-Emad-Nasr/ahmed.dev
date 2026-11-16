/*
 * ═══ components/blog/CaseLinkGrid.tsx — a grid of cases that open their page ═══
 *
 * Used by the collection pages (/attack/<T-id>, /writeups/<platform>): each
 * card is a link to /blog/<case-id> with its cover, date, category, title,
 * a two-line blurb and the platform / difficulty. Long lists show 9 at a
 * time behind the site's "Show more" button.
 *
 * Server component: it gets the cases ready-made from the page.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import ShowMore from "@/components/ui/ShowMore";
import { chipNeutral, chipTertiary } from "@/components/ui/kit";
import { caseCardBlurb } from "@/lib/case-summary";
import { formatDate, getThumbnail, normalizePublicHref, type CaseEvidence } from "@/lib/shared";

/* The small cover (npm run thumbs) when it exists, else the full image */
const cover = (image: string) => {
  const thumb = getThumbnail(image);
  return normalizePublicHref(existsSync(join(process.cwd(), "public", thumb)) ? thumb : image);
};

export default function CaseLinkGrid({ cases, label = "Show more cases" }: { cases: readonly CaseEvidence[]; label?: string }) {
  return (
    <ShowMore as="ul" first={9} step={9} label={label} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cases.map((c) => (
        <li key={c.id} className="flex">
          <Link
            prefetch={false}
            href={`/blog/${c.id}`}
            className="group spotlight relative flex w-full flex-col bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-300 overflow-hidden"
          >
            {c.image && (
              <span className="relative block aspect-video overflow-hidden bg-surface">
                <Image
                  src={cover(c.image)}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </span>
            )}
            <span className="flex flex-1 flex-col p-6">
              <span className="flex flex-wrap items-center justify-between gap-2 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-tertiary">
                <span>{c.category}</span>
                <time dateTime={c.date}>{formatDate(c.date)}</time>
              </span>
              <span className="mt-3 font-display text-lg font-black uppercase tracking-tight leading-tight text-foreground group-hover:text-primary-ink transition-colors duration-300">
                {c.title}
              </span>
              <span className="mt-3 text-sm text-foreground/60 font-light leading-relaxed line-clamp-3">
                {caseCardBlurb(c.description)}
              </span>
              <span className="mt-auto pt-5 flex flex-wrap gap-2">
                <span className={chipTertiary}>{c.platform}</span>
                <span className={chipNeutral}>{c.difficulty}</span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ShowMore>
  );
}
