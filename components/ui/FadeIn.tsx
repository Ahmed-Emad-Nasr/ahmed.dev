"use client";

/*
 * ═══ components/ui/FadeIn.tsx — the entrance animation used everywhere ═══
 *
 * Default = Sensei-Dev's Reveal (lib/motion.ts → REVEAL): fade + 8px rise
 * in 0.4s, once, when the element is 40px into the screen. No stagger.
 * `as` keeps the real tag (li, nav, figure …).
 *
 *   <FadeIn> … </FadeIn>                                  the default
 *   <FadeIn y={30} duration={0.8} ease={MOTION_EASE}>     a bigger one
 *   <FadeIn x={-100} y={0} duration={1.2} replay>         slides in from the
 *        left, and back out when scrolled up past it again (experience cards)
 * Props: as · x / y (px it starts from) · duration / delay (s) · ease ·
 *   margin (the viewport margin that counts as "in view") · replay ·
 *   + any normal HTML props.
 *
 * opacity + transform (not framer's x/y) so the browser runs it off the main
 * thread (WAAPI). Under the intro screen nothing plays: an element already in
 * view starts as the screen lifts (lib/intro.ts).
 */

import { m, useAnimationControls } from "framer-motion";
import { useRef, type ComponentProps } from "react";
import { whenIntroDone } from "@/lib/intro";
import { REVEAL } from "@/lib/motion";

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
  duration?: number;
  delay?: number;
  ease?: readonly [number, number, number, number];
  margin?: string;
  /** Play backwards when it leaves through the bottom (scrolling back up) */
  replay?: boolean;
  /* attributes some tags take (a, button) */
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  popoverTarget?: string;
};

const shown = { opacity: 1, transform: "translate(0px, 0px)" };

export default function FadeIn({
  as = "div",
  x = 0,
  y = REVEAL.y,
  duration = REVEAL.duration,
  delay = 0,
  ease = REVEAL.ease,
  margin = REVEAL.margin,
  replay = false,
  ...rest
}: FadeInProps) {
  const Element = m[as] as typeof m.div;
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const hidden = { opacity: 0, transform: `translate(${x}px, ${y}px)` };

  return (
    <Element
      ref={ref}
      initial={hidden}
      animate={controls}
      viewport={{ once: !replay, margin }}
      onViewportEnter={() =>
        whenIntroDone(() => {
          if (!ref.current) return; // left the page while waiting
          void controls.start({ ...shown, transition: { duration, delay, ease: [...ease] as [number, number, number, number] } });
        })
      }
      onViewportLeave={
        replay
          ? (entry) => {
              /* Only back out when it drops below the screen (scrolling up) */
              if (entry && entry.boundingClientRect.top > 0) {
                void controls.start({ ...hidden, transition: { duration, ease: [...ease] as [number, number, number, number] } });
              }
            }
          : undefined
      }
      {...rest}
    />
  );
}
