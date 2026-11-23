"use client";

/*
 * FadeIn — the site's entrance: fade + slide, once, when 40px of the element
 * is on screen (Sensei-Dev's tempo). `as` keeps the real tag (li, nav, figure …).
 *
 *  · Elements without a delay entering in the same frame start top to bottom,
 *    80 ms apart; lists stagger through their own `delay`.
 *  · opacity + transform (not framer's x/y) so the browser runs them off the
 *    main thread (WAAPI) and a cascade never stutters the scroll.
 *
 * ═══ components/ui/FadeIn.tsx — the entrance animation used everywhere ═══
 * Wrap anything:
 *   <FadeIn y={24} duration={0.65} delay={0.1}> … </FadeIn>
 *   <FadeIn as="li" x={-32} y={0}> … </FadeIn>      (slides in from the left)
 * Props:
 *   as        → the HTML tag to render (default div)
 *   x / y     → where it starts, in px (negative x = from the left)
 *   duration  → seconds;  delay → extra seconds before it starts
 *   + any normal HTML props (className, href, aria-*…)
 * Global feel (ease curve, stagger gap) → lib/motion.ts.
 */

import { m, useAnimationControls } from "framer-motion";
import { useRef, type ComponentProps } from "react";
import { whenIntroDone } from "@/lib/intro";
import { isLiteDevice } from "@/lib/fx";
import {
  MOTION_EASE,
  MOTION_ENTER_DURATION,
  MOTION_STAGGER_STEP,
} from "@/lib/motion";

type Tag =
  | "div"
  | "li"
  | "ul"
  | "ol"
  | "dl"
  | "nav"
  | "header"
  | "figure"
  | "span"
  | "section"
  | "p"
  | "article"
  | "aside"
  | "footer"
  | "button"
  | "a"
  | "h1"
  | "h2"
  | "h3"
  | "h4";

type FadeInProps = Omit<
  ComponentProps<typeof m.div>,
  "initial" | "animate" | "whileInView" | "viewport" | "transition" | "ref"
> & {
  as?: Tag;
  x?: number;
  y?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  /* attributes some tags take (a, button) */
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  popoverTarget?: string;
};

/* The tempo is Sensei-Dev's: each entrance takes the duration its caller
   passes (0.65–0.7 s on most cards), travels the distance it passes, and
   starts as soon as 40px of it is on screen. Lists stagger through their
   own `delay` (index × MOTION_STAGGER_STEP); the delay is capped at 8 steps
   so item 20 of a "Show more" list does not wait 1.6 s.
   Speed dials for the whole site: MOTION_ENTER_DURATION / MOTION_EASE in
   lib/motion.ts. */
const MAX_DELAY = 8 * MOTION_STAGGER_STEP;

/* Elements without a delay of their own that enter in the same frame (a
   header's eyebrow, title and text) start top to bottom, one step apart */
let batch: { el: Element; play: (order: number) => void }[] = [];
function enqueue(el: Element, play: (order: number) => void) {
  if (!batch.length) {
    requestAnimationFrame(() => {
      const now = batch;
      batch = [];
      now.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      now.forEach((item, order) => item.play(order));
    });
  }
  batch.push({ el, play });
}

export default function FadeIn({
  as = "div",
  x = 0,
  y = 24,
  scale = 1,
  duration = 0.65,
  delay = 0,
  ...rest
}: FadeInProps) {
  const Element = m[as] as typeof m.div;
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  return (
    <Element
      ref={ref}
      initial={{
        opacity: 0,
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
      }}
      animate={controls}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      onViewportEnter={() =>
        /* Under the intro screen nothing plays: it starts as the screen lifts */
        whenIntroDone(() => {
          if (!ref.current) return; // left the page while waiting
          /* A weak device: shown at once, no animation work */
          if (isLiteDevice()) {
            controls.set({ opacity: 1, transform: "none" });
            return;
          }
          enqueue(ref.current, (order) => {
            void controls.start({
              opacity: 1,
              transform: "translate(0px, 0px) scale(1)",
              transition: {
                duration: duration || MOTION_ENTER_DURATION,
                delay: delay ? Math.min(delay, MAX_DELAY) : Math.min(order, 4) * MOTION_STAGGER_STEP,
                ease: MOTION_EASE,
              },
            });
          });
        })
      }
      {...rest}
    />
  );
}
