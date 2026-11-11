/* ═══ lib/motion.ts — the site's animation feel, in one place ═══
   Used by FadeIn, SlashDivider and others. */
/* Cubic-bezier ease curve: fast start, long soft landing */
export const MOTION_EASE = [0.23, 1, 0.32, 1] as const;
/* Default entrance length, in seconds */
export const MOTION_ENTER_DURATION = 0.71;
/* Gap between elements that enter together, in seconds */
export const MOTION_STAGGER_STEP = 0.07;
