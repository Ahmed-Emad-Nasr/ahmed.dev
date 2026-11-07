/*
 * Logo — an organisation's, platform's or tool's logo (data/logos.ts):
 * the official file from public/Assets/logos/ when there is one, else the
 * brand mark, else a monogram in the site's style. No hooks, so it renders
 * the same on the server and in client sections.
 *
 *   <Logo name="Banque Misr" />                 tile (experience, platforms …)
 *   <Logo name="Burp Suite" variant="inline" /> a small mark inside a chip
 */

import { logoFor, type LogoSpec } from "@/data/logos";
import { LOGO_FILES, LOGO_MARKS } from "@/components/ui/logo-data";
import { normalizePublicHref } from "@/lib/shared";

type LogoProps = {
  /** A name as written in the data — resolved by logoFor() */
  name?: string;
  /** Or the spec itself */
  spec?: LogoSpec;
  /** Box size in px (tile) or mark size (inline) */
  size?: number;
  variant?: "tile" | "inline";
  className?: string;
  /** Announce the logo (role="img") — leave off when the name is printed next to it */
  labelled?: boolean;
};

export default function Logo({ name, spec, size, variant = "tile", className = "", labelled = false }: LogoProps) {
  const logo = spec ?? logoFor(name);
  const a11y = labelled && logo ? { role: "img" as const, "aria-label": `${logo.label} logo` } : { "aria-hidden": true as const };
  const file = logo ? LOGO_FILES[logo.slug] : undefined;
  const mark = logo?.icon ? LOGO_MARKS[logo.icon] : undefined;
  const mono = logo?.mono ?? (name ?? "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();

  if (variant === "inline") {
    const s = size ?? 12;
    if (file)
      return (
        <span {...a11y} className={`inline-grid shrink-0 place-items-center bg-white p-[1px] ${className}`} style={{ width: s + 2, height: s + 2 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={normalizePublicHref(file)} alt="" width={s} height={s} loading="lazy" decoding="async" className="h-full w-full object-contain" />
        </span>
      );
    if (mark)
      return (
        <svg {...a11y} viewBox="0 0 24 24" width={s} height={s} className={`shrink-0 ${mark[1] ? "" : "text-foreground/80"} ${className}`} style={mark[1] ? { color: mark[1] } : undefined} fill="currentColor">
          <path d={mark[2]} />
        </svg>
      );
    return null;
  }

  const s = size ?? 48;
  const box = `relative grid shrink-0 place-items-center overflow-hidden border ${className}`;
  if (file)
    return (
      <span {...a11y} className={`${box} border-foreground/10 bg-white p-1.5`} style={{ width: s, height: s }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={normalizePublicHref(file)} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </span>
    );
  if (mark)
    return (
      <span {...a11y} className={`${box} border-foreground/10 bg-foreground/[0.04]`} style={{ width: s, height: s }}>
        <svg viewBox="0 0 24 24" width={Math.round(s * 0.52)} height={Math.round(s * 0.52)} fill="currentColor" className={mark[1] ? "" : "text-foreground/85"} style={mark[1] ? { color: mark[1] } : undefined}>
          <path d={mark[2]} />
        </svg>
      </span>
    );
  return (
    <span
      {...a11y}
      className={`${box} border-primary/30 bg-primary/[0.06] font-mono font-black tracking-[0.06em] text-primary-ink`}
      style={{ width: s, height: s, fontSize: Math.max(9, Math.round(s / (mono.length > 3 ? 4.4 : mono.length > 2 ? 3.6 : 3))) }}
    >
      {mono}
    </span>
  );
}

/** A row of small tool logos (a project's stack, a case's tools) */
export function LogoRow({ specs, size = 28, className = "" }: { specs: readonly LogoSpec[]; size?: number; className?: string }) {
  if (specs.length === 0) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Tools and platforms">
      {specs.map((spec) => (
        <li key={spec.slug} title={spec.label}>
          <Logo spec={spec} size={size} labelled />
        </li>
      ))}
    </ul>
  );
}
