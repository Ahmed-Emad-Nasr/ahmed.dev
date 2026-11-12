/*
 * OrgLogo — the logo of a company, platform or tool, in the site's own box.
 *
 * ═══ components/ui/OrgLogo.tsx ═══
 * <OrgLogo name="Huawei" />            → 48px box (experience, platforms, teaching)
 * <OrgLogo name="Cisco" size="sm" />   → 28px box (certificate and project cards)
 * <OrgLogo name="…" strict />          → draws nothing when there is no real
 *                                        logo (used in rows of tool icons,
 *                                        where a monogram would be noise)
 * Which logo a name gets, and how to add your own image files → data/logos.ts.
 * Brand marks are drawn in one colour (currentColor) so they sit in the
 * theme like the rest of the icons and light up red with their card.
 */

import Image from "next/image";
import { LOGO_FILES, brandIconOf, monogramOf } from "@/data/logos";
import { normalizePublicHref } from "@/lib/shared";

const BOX = {
  md: "w-12 h-12 text-xs",
  sm: "w-7 h-7 text-[0.5rem]",
} as const;
const ICON = { md: 22, sm: 14 } as const;

/* The bare brand mark, for use inside a chip or a line of text.
   Draws nothing when the name has no mark. */
export function BrandGlyph({ name, size = 11, className = "" }: { name: string; size?: number; className?: string }) {
  const icon = brandIconOf(name);
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" className={`shrink-0 ${className}`}>
      <path d={icon.path} />
    </svg>
  );
}

export default function OrgLogo({
  name,
  size = "md",
  strict = false,
  fallback,
  className = "",
}: {
  name: string;
  size?: keyof typeof BOX;
  /** true → render nothing unless a real logo exists */
  strict?: boolean;
  /** Monogram to use instead of the automatic initials (e.g. "THM") */
  fallback?: string;
  className?: string;
}) {
  const file = LOGO_FILES[name];
  const icon = file ? undefined : brandIconOf(name);
  if (strict && !file && !icon) return null;

  const box = `grid place-items-center shrink-0 border border-primary/30 bg-primary/[0.06] text-primary-ink transition-colors duration-300 ${BOX[size]} ${className}`;

  if (file) {
    return (
      <span className={`${box} overflow-hidden bg-white p-1`}>
        <Image
          src={normalizePublicHref(file)}
          alt={`${name} logo`}
          width={96}
          height={96}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  if (icon) {
    return (
      <span className={box} title={name}>
        <svg viewBox="0 0 24 24" width={ICON[size]} height={ICON[size]} fill="currentColor" role="img" aria-label={`${icon.title} logo`}>
          <path d={icon.path} />
        </svg>
      </span>
    );
  }

  return (
    <span className={`${box} font-mono font-black tracking-[0.1em]`} aria-hidden="true">
      {fallback ?? monogramOf(name)}
    </span>
  );
}
