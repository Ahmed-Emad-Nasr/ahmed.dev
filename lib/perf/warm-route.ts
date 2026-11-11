/*
 * ═══ lib/perf/warm-route.ts — the code a page needs for its FIRST screen ═══
 *
 * Next's prefetch (router.prefetch) downloads a page's data, not its
 * JavaScript. So opening a case page used to wait for the data, then start
 * downloading the article's code, then show a grey skeleton until it
 * arrived. warmRouteCode() starts that code download at the same moment as
 * the data — on hover / focus / touch of a link (components/ui/PageLink.tsx).
 *
 * Add a page: one line below — when the path matches, import the same
 * modules its page imports through dynamic() for its first screen.
 */

type Warm = [match: (path: string) => boolean, load: () => Promise<unknown>];

const FIRST_SCREEN: Warm[] = [
  [(p) => p.startsWith("/blog/"), () => import("@/components/blog/CaseArticle")],
];

const started = new Set<number>();

export function warmRouteCode(href: string): void {
  const path = href.split(/[?#]/)[0]!.replace(/\/+$/, "") || "/";
  const index = FIRST_SCREEN.findIndex(([match]) => match(path));
  if (index < 0 || started.has(index)) return;
  started.add(index);
  FIRST_SCREEN[index]![1]().catch(() => started.delete(index)); // retried on the next hover
}
