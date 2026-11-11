"use client";

/*
 * The case library on the blog page (#start-here, #cases, then #videos).
 * Filters are synced to the URL; cards are paged a few at a time, while
 * filtering always searches the whole library. The data is computed at
 * build time (lib/library-data.ts) by app/blog/page.tsx and arrives as the
 * `data` prop — the raw case files never reach the browser.
 *
 * ═══ components/blog/CaseLibrarySection.tsx — the CASE LIBRARY on /blog ═══
 *
 * Pieces it puts together:
 *   StartHere      → 3 recommended reports (#start-here, data/start-here.ts)
 *   CaseFilters    → search box, kind / category tabs, tool chips, sort, view
 *   CaseCard       → one case as a card    (view = cards)
 *   CaseList       → all cases as a table  (view = list)
 *   MediaSections  → the numbers strip + the YouTube videos (#videos)
 *   Lightbox       → screenshot viewer, opened from a card
 *
 * FILTERS LIVE IN THE URL, so a filtered view can be shared/linked:
 *   ?q=wazuh            search text           ?kind=investigation  case kind
 *   ?cat=Malware…       category              ?tools=Wazuh,Splunk  tool chips
 *   ?sort=newest        sort order            ?view=list           table view
 *   e.g. /blog?kind=investigation#cases
 * (CaseFilterLink builds these links from anywhere on the site.)
 *
 * HOW TO EDIT
 *   • Cards per "load more" → PAGE below.
 *   • Add a case → data/cases.ts (it appears here, in filters and counts).
 *   • Card look → CaseCard.tsx; filter bar → CaseFilters.tsx.
 */

import dynamic from "next/dynamic";
import { Suspense, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import SlashDivider from "@/components/ui/SlashDivider";
import { preloadable } from "@/lib/perf/lazy";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { normalizePublicHref, type CaseKind } from "@/lib/shared";
import type { GalleryState } from "@/lib/shared";
import CaseFilters from "@/components/blog/CaseFilters";
import StartHere from "@/components/blog/StartHere";
import type { LibraryData } from "@/lib/library-data";
import { scrollToHash } from "@/lib/perf/jump";
import CaseCard from "@/components/blog/CaseCard";
import CaseList from "@/components/blog/CaseList";
import { CounterBadge, KanjiWatermark } from "@/components/ui/kit";

const MediaSections = dynamic(() => import("@/components/blog/MediaSections"));
/* preloadable = fetched in idle time and then rendered without a suspended
   frame: React holds back a suspended→ready swap for ~300ms, which is what
   made the first open feel late. */
const Lightbox = preloadable(() => import("@/components/ui/Lightbox"));

/* Cards shown at first and added per "show more" */
const PAGE = 6;
/* The full screenshot lists, fetched once on the first gallery open */
let screenshotsRequest: Promise<Record<string, string[]>> | null = null;
const loadScreenshots = () => {
  screenshotsRequest ??= fetch(normalizePublicHref("case-screenshots.json"))
    .then((response) => (response.ok ? response.json() : {}))
    .catch(() => {
      screenshotsRequest = null; // let the next click try again
      return {};
    });
  return screenshotsRequest;
};

/* Everything a case can be searched by, as one lowercase string */
const buildSearchIndex = (cases: LibraryData["cases"]): Record<string, string> =>
  Object.fromEntries(
    cases.map((item) => [
      item.id,
      [item.title, item.description, item.platform, item.type, item.category, item.difficulty, ...(item.tags ?? []), ...(item.tools ?? []), ...(item.skillsGained ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    ]),
  );

export default function CaseLibrarySection({ data }: { data: LibraryData }) {
  const { cases: sortedCases, kindFacets, categoryFacets, toolFacets, counts: libraryCounts, mediaById } = data;
  const searchIndex = useMemo(() => buildSearchIndex(sortedCases), [sortedCases]);
  const WSA_LAB_COUNT = useMemo(() => sortedCases.filter((c) => c.platform === "PortSwigger").length, [sortedCases]);

  const [gallery, setGallery] = useState<GalleryState | null>(null);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [activeKind, setActiveKind] = useState<CaseKind | null>(null);
  const [sort, setSort] = useState<"recommended" | "newest">("recommended");
  const [view, setView] = useState<"cards" | "list">("cards");
  /* A #case-… deep link past the first page opens the pages up to it from
     the start (this section only mounts in the browser — LazySection) */
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return PAGE;
    const hash = window.location.hash;
    const at = hash.startsWith("#case-") ? sortedCases.findIndex((item) => `#case-${item.id}` === hash) : -1;
    return at >= PAGE ? Math.ceil((at + 1) / PAGE) * PAGE : PAGE;
  });

  const deferredQuery = useDeferredValue(query);

  const isFiltering =
    deferredQuery.trim() !== "" || activeCategory !== null || activeTools.length > 0 || activeKind !== null;

  /* "Newest" re-sorts by date; "Recommended" is the build-time order */
  const orderedPdfs = useMemo(
    () => (sort === "newest" ? [...sortedCases].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")) : sortedCases),
    [sort, sortedCases],
  );

  const visiblePdfs = useMemo(() => {
    if (!isFiltering) return orderedPdfs;

    const needle = deferredQuery.trim().toLowerCase();

    return orderedPdfs.filter((item) => {
      if (activeKind && item.kind !== activeKind) return false;
      if (needle && !(searchIndex[item.id] ?? "").includes(needle)) return false;
      if (activeCategory && item.category !== activeCategory) return false;
      if (activeTools.length > 0) {
        const tools = item.tools ?? [];
        if (!activeTools.some((tool) => tools.includes(tool))) return false;
      }
      return true;
    });
  }, [orderedPdfs, isFiltering, deferredQuery, activeCategory, activeTools, activeKind, searchIndex]);

  /* A new filter starts from the first page again */
  const toolsKey = activeTools.join(",");
  const firstFilterRun = useRef(true);
  useEffect(() => {
    /* not on mount — a #case-… deep link may already have opened more pages */
    if (firstFilterRun.current) {
      firstFilterRun.current = false;
      return;
    }
    setVisible(PAGE);
  }, [deferredQuery, activeCategory, toolsKey, activeKind, sort]);

  /* Filters live in the URL (?q=…&cat=…&tools=…) so a filtered view can be
     shared and survives the back button. */
  const filtersHydrated = useRef(false);

  useEffect(() => {
    const readFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      setActiveCategory(params.get("cat"));
      const tools = params.get("tools");
      setActiveTools(tools ? tools.split(",").filter(Boolean) : []);
      const kind = params.get("kind");
      setActiveKind(kind === "investigation" || kind === "project" || kind === "lab" || kind === "note" ? kind : null);
      setSort(params.get("sort") === "newest" ? "newest" : "recommended");
      setView(params.get("view") === "list" ? "list" : "cards");
    };

    readFromUrl();
    filtersHydrated.current = true;
    /* Arriving with a filter in the URL (a tag link on a case page): bring the library into view */
    let arrival: number | undefined;
    if (window.location.search && !window.location.hash.startsWith("#case-")) {
      arrival = window.setTimeout(() => scrollToHash("#cases"), 400);
    }

    window.addEventListener("popstate", readFromUrl);
    return () => {
      window.clearTimeout(arrival);
      window.removeEventListener("popstate", readFromUrl);
    };
  }, []);

  useEffect(() => {
    if (!filtersHydrated.current) return;

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (activeCategory) params.set("cat", activeCategory);
      if (activeTools.length) params.set("tools", activeTools.join(","));
      if (activeKind) params.set("kind", activeKind);
      if (sort !== "recommended") params.set("sort", sort);
      if (view !== "cards") params.set("view", view);

      const search = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`,
      );
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query, activeCategory, activeTools, activeKind, sort, view]);

  const toggleTool = useCallback((tool: string) => {
    setActiveTools((current) =>
      current.includes(tool) ? current.filter((t) => t !== tool) : [...current, tool],
    );
  }, []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setActiveCategory(null);
    setActiveTools([]);
    setActiveKind(null);
  }, []);

  const openGallery = useCallback(async (title: string, id: string, index = 0) => {
    const screenshots = (await loadScreenshots())[id] ?? [];
    if (screenshots.length) {
      setGallery({ title, screenshots, index: Math.min(Math.max(index, 0), screenshots.length - 1) });
    }
  }, []);

  /* Deep links (#case-…): the cards render after hydration, so wait for the
     target instead of letting the browser give up on the first try. */
  const hashTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#case-")) return;

    let cancelled = false;
    let attempts = 0;

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(hash.slice(1));
      if (el) {
        scrollToHash(hash);
        return;
      }
      if (attempts++ < 20) hashTimer.current = window.setTimeout(tryScroll, 100);
    };

    hashTimer.current = window.setTimeout(tryScroll, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(hashTimer.current);
    };
  }, [sortedCases]);

  const slides = useMemo(
    () =>
      (gallery?.screenshots ?? []).map((shot, i) => ({
        src: normalizePublicHref(shot),
        title: gallery?.title ?? "",
        description: `Screenshot ${i + 1} of ${gallery?.screenshots.length ?? 0}`,
      })),
    [gallery],
  );

  return (
    <>
      <section id="cases" className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden" aria-label="Case library">
        <KanjiWatermark chars="事件簿" side="right" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-8">
            <SectionHeader
              titleA="Case"
              titleB="Library."
              description={`${libraryCounts.total} pieces of security work, each written as a story: the goal, what happened, what I did and how to prevent it. ${libraryCounts.reports} are full investigations of real-style incidents; the rest are projects, practice labs and study notes. Search by a word, or pick a kind of work below.`}
            />
            <div className="mb-16 md:mb-20">
              <CounterBadge value={libraryCounts.total} top="Cases" bottom="Indexed" tone="accent" />
            </div>
          </div>

          <StartHere entries={data.startHere} />

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-[2px] bg-primary" aria-hidden="true" />
            <h2 className="text-primary-ink text-[0.6875rem] font-mono font-bold tracking-[0.35em] uppercase">
              All cases
            </h2>
            <span className="jp-eyebrow text-[0.6875rem] text-foreground/30" lang="ja" aria-hidden="true" data-jp="全件" />
          </div>

          <CaseFilters
            query={query}
            onQueryChange={setQuery}
            categories={categoryFacets}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            tools={toolFacets}
            activeTools={activeTools}
            onToolToggle={toggleTool}
            resultCount={visiblePdfs.length}
            totalCount={libraryCounts.total}
            onReset={resetFilters}
            kinds={kindFacets}
            activeKind={activeKind}
            onKindChange={setActiveKind}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
          />

          {/* The 29 PortSwigger labs also read as one track */}
          {(activeKind === null || activeKind === "lab") && !deferredQuery && (
            <FadeIn y={16} duration={0.6} className="mb-10">
              <button
                type="button"
                onClick={() => {
                  setQuery("PortSwigger");
                  setActiveKind(null);
                }}
                className="group relative w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-tertiary/25 bg-tertiary/5 px-6 py-5 overflow-hidden hover:border-tertiary/60 transition-colors duration-300 cursor-pointer"
              >
                <span className="absolute inset-y-0 left-0 w-[3px] bg-tertiary" aria-hidden="true" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-tertiary/10 to-transparent transition-transform duration-600 group-hover:translate-x-full" aria-hidden="true" />
                <span>
                  <span className="block font-mono text-[0.5625rem] font-bold uppercase tracking-[0.3em] text-tertiary">Collection · PortSwigger</span>
                  <span className="block mt-1 font-display text-lg md:text-xl font-black uppercase tracking-tight text-foreground">
                    Web Security Academy Track — {WSA_LAB_COUNT} labs by vulnerability class
                  </span>
                </span>
                <span className="flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-tertiary">
                  Filter {WSA_LAB_COUNT} labs <ArrowUpRight size={14} className="transition-transform duration-180 group-hover:translate-x-[1.7px] group-hover:-translate-y-[1.7px]" />
                </span>
              </button>
            </FadeIn>
          )}

          {view === "list" ? (
            <CaseList items={visiblePdfs.slice(0, Math.max(visible, 24))} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visiblePdfs.slice(0, visible).map((item, idx) => (
                <CaseCard
                  key={item.id}
                  index={idx}
                  {...item}
                  cover={mediaById[item.id]?.cover}
                  shotCount={mediaById[item.id]?.count ?? 0}
                  onOpenGallery={openGallery}
                />
              ))}
            </div>
          )}

          {(view === "list" ? Math.max(visible, 24) : visible) < visiblePdfs.length && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((n) => Math.min(visiblePdfs.length, (view === "list" ? Math.max(n, 24) : n) + (view === "list" ? 24 : PAGE)))}
                className="group flex items-center gap-3 px-8 py-4 border border-foreground/15 border-l-2 border-l-primary bg-foreground/[0.02] backdrop-blur-md text-foreground font-mono font-bold uppercase tracking-widest text-sm transition-all duration-180 hover:border-primary hover:bg-primary/10 hover:-translate-y-[1.7px] active:translate-y-0"
              >
                <ChevronDown size={14} className="text-primary-ink transition-transform duration-180 group-hover:translate-y-[1.7px]" />
                Show more cases
                <span className="font-mono text-[0.625rem] text-foreground/60 tabular-nums">
                  {Math.min(view === "list" ? Math.max(visible, 24) : visible, visiblePdfs.length)}/{visiblePdfs.length}
                </span>
              </button>
            </div>
          )}

          {visiblePdfs.length === 0 && (
            <div className="relative bg-surface/60 border border-foreground/10 p-10 md:p-14 text-center">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" aria-hidden="true" />
              <p className="brush-jp text-4xl text-accent/80 mb-4" lang="ja" aria-hidden="true" data-jp="該当なし" />
              <p className="font-mono text-sm text-foreground/60 tracking-wider mb-4">Nothing matches these filters. Try a shorter word, or clear them to see every case.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-primary-ink underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <SlashDivider label="02 // Case files" japanese="調査" origin="left" />

      <div id="videos" className="px-6 md:px-20 pt-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <MediaSections counts={libraryCounts} />
        </div>
      </div>

      {gallery && (
        <Suspense fallback={null}>
          <Lightbox
            close={() => setGallery(null)}
            index={gallery.index}
            slides={slides}
          />
        </Suspense>
      )}
    </>
  );
}
