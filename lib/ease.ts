/*
 * ═══ lib/ease.ts — GSAP's ease curves for the browser's own animations ═══
 *
 * The hero entrance and the experience cards used to be drawn by GSAP (26 KB
 * of script on the home and teaching pages). They are now drawn by the
 * browser itself (element.animate, which also runs off the main thread), with
 * GSAP's exact curves: CSS `linear()` draws any curve from points, and the
 * points below come from GSAP's own formulas, so the motion is the same.
 * A browser too old for `linear()` gets the closest cubic-bezier.
 *
 *   EASE["power2.out"]  → 1 − (1 − t)³         (GSAP "power2.out")
 *   EASE["expo.out"]    → 1 − 2^(−10t)         (GSAP "expo.out")
 */

type Curve = (t: number) => number;

const CURVES: Record<"power2.out" | "expo.out", { fn: Curve; fallback: string }> = {
  "power2.out": { fn: (t) => 1 - Math.pow(1 - t, 3), fallback: "cubic-bezier(0.33, 1, 0.68, 1)" },
  "expo.out": { fn: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)), fallback: "cubic-bezier(0.16, 1, 0.3, 1)" },
};

/* Points packed toward the start, where these curves are steepest */
const toLinear = (fn: Curve, steps = 48): string => {
  const stops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = Math.pow(i / steps, 1.6);
    stops.push(`${+fn(t).toFixed(4)} ${+(t * 100).toFixed(2)}%`);
  }
  return `linear(${stops.join(", ")})`;
};

/** What gsap.from() does to a moved element: at the start it switches off
    the CSS translate / rotate / scale properties (its transform replaces
    them), and when it ends it leaves the final opacity and
    `transform: translate(0px, 0px)` inline — kept identical here, so the
    page is exactly as GSAP left it (same stacking, same hover behaviour). */
export function gsapStart(el: HTMLElement): void {
  el.style.translate = "none";
  el.style.rotate = "none";
  el.style.scale = "none";
}
export function gsapEnd(el: HTMLElement, opacity: string, moved = true): void {
  el.style.opacity = opacity;
  if (moved) el.style.transform = "translate(0px, 0px)";
}

let cache: Record<string, string> | null = null;

/** The `easing` value for element.animate() that draws GSAP's curve */
export function gsapEase(name: keyof typeof CURVES): string {
  if (!cache) {
    const supported = typeof CSS !== "undefined" && CSS.supports("animation-timing-function", "linear(0, 1)");
    cache = Object.fromEntries(
      Object.entries(CURVES).map(([k, c]) => [k, supported ? toLinear(c.fn) : c.fallback]),
    );
  }
  return cache[name];
}
