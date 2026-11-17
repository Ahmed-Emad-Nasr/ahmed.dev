"use client";

/*
 * ═══ components/layout/PageGuideMount.tsx ═══
 * Loads the "what's on this page" note (PageGuide.tsx) only once the browser
 * is idle, so it never competes with the page itself.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PageGuide = dynamic(() => import("@/components/layout/PageGuide"), { ssr: false });

export default function PageGuideMount() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = idle(() => setOn(true));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, []);
  return on ? <PageGuide /> : null;
}
