/* ═══ lib/motion.ts — the site's animation feel, in one place ═══
   Used by FadeIn, RevealText, CounterChip and others. */
/* Cubic-bezier ease curve: quick start, long soft landing — Sensei-Dev's */
export const MOTION_EASE = [0.23, 1, 0.32, 1] as const;
/* Default entrance length, in seconds */
export const MOTION_ENTER_DURATION = 0.7; // Sensei-Dev's tempo
/* Gap between elements that enter together, in seconds */
export const MOTION_STAGGER_STEP = 0.08; // Sensei-Dev's tempo
