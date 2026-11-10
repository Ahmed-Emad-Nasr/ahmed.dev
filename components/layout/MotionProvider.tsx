"use client";

/*
 * framer-motion in its lazy form: components use `m`, and the animation
 * engine (domAnimation) loads once as its own chunk. `strict` makes a stray
 * full `motion` import throw in development. Layout animations or drag
 * would need domMax in motion-features.ts.
 *
 * ═══ components/layout/MotionProvider.tsx (wraps the whole site in app/layout.tsx) ═══
 * RULE FOR NEW COMPONENTS: import `m` (not `motion`) from framer-motion, e.g.
 *   import { m as motion } from "framer-motion";
 * — that's the pattern every component here uses.
 */

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = () => import("@/components/layout/motion-features").then((mod) => mod.default);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {/* reducedMotion="user": the OS "reduce motion" setting drops the movement */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
