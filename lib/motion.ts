/* ═══ lib/motion.ts — the site's animation feel, in one place ═══
   The values are Sensei-Dev's (the site this one grew from), one for one. */

/* The site's curve: fast start, long soft landing (Sensei-Dev's EASE) */
export const MOTION_EASE = [0.23, 1, 0.32, 1] as const;

/* The everyday entrance (Sensei-Dev's Reveal): fade + 8px rise in 0.4s,
   once, when the element is 40px into the screen. FadeIn's defaults. */
export const REVEAL = { y: 8, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const, margin: "-40px" };

/* GSAP's "expo.out" as a cubic-bezier — the experience cards' slide */
export const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
