/*
 * ═══ lib/in-view.ts — "tell me once when this element reaches the screen" ═══
 * One IntersectionObserver per margin is shared by every caller (FadeIn,
 * CountUp, …) instead of one observer per element. The callback runs once,
 * the first time any part of the element is inside the viewport shrunk by
 * `margin` (same meaning as framer-motion's `once: true` + `margin`), and the
 * element is then no longer watched.
 *
 *   const stop = onceInView(el, () => play(), "0px 0px -40px 0px");
 *   …later (unmount): stop();
 *
 * A browser without IntersectionObserver runs the callback at once, so
 * nothing stays hidden.
 */

type Group = { io: IntersectionObserver; calls: Map<Element, () => void> };
const groups = new Map<string, Group>();

export function onceInView(el: Element, cb: () => void, margin = "0px"): () => void {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  let group = groups.get(margin);
  if (!group) {
    const calls = new Map<Element, () => void>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const call = calls.get(entry.target);
          if (!call) continue;
          calls.delete(entry.target);
          io.unobserve(entry.target);
          call();
        }
      },
      { rootMargin: margin },
    );
    group = { io, calls };
    groups.set(margin, group);
  }
  const { io, calls } = group;
  calls.set(el, cb);
  io.observe(el);
  return () => {
    if (calls.delete(el)) io.unobserve(el);
  };
}
