"use client";

/*
 * ═══ components/layout/DeferredGlobalEffects.tsx ═══
 * Three site-wide helpers that load only once the browser is idle (after the
 * page is shown), so they never slow down the first paint:
 *   • SpotlightHost        (components/ui/Motion.tsx) → makes the glow follow
 *                          the mouse on every `.spotlight` card.
 *   • OffscreenAnimations  (lib/perf/OffscreenAnimations.tsx) → pauses CSS
 *                          animations that are off-screen, to save CPU/battery.
 *   • ScrollShield         (lib/perf/ScrollShield.tsx) → no hover effects
 *                          while the page scrolls fast (the main scroll stutter).
 * No visible UI of its own.
 */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SpotlightHost = dynamic(() => import("@/components/ui/Motion").then((mod) => mod.SpotlightHost), {
  ssr: false,
});
const OffscreenAnimations = dynamic(() => import("@/lib/perf/OffscreenAnimations"), { ssr: false });
const ScrollShield = dynamic(() => import("@/lib/perf/ScrollShield"), { ssr: false });

export default function DeferredGlobalEffects() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1200));
    const id = idle(() => setReady(true));
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  return ready ? (
    <>
      <SpotlightHost />
      <OffscreenAnimations />
      <ScrollShield />
    </>
  ) : null;
}
