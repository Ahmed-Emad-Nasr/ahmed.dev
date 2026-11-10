/* ═══ components/ui/SectionSkeleton.tsx — grey pulsing placeholder ═══
   Shown while a section's JS chunk downloads (the `loading` option in
   components/home/dynamic.tsx and components/blog/dynamic.tsx).
   lines = number of grey cards, tall = more vertical padding. */
export default function SectionSkeleton({
  lines = 3,
  tall = false,
}: {
  lines?: number;
  tall?: boolean;
}) {
  /* data-lazy-pending: a section whose code is still on its way. A jump to an
     anchor (lib/perf/jump.ts → revealAll) waits for these to go, so a
     navbar link from /blog or /gallery to /#work lands on the section, not
     on a skeleton that is about to change height. */
  return (
    <section
      data-lazy-pending=""
      aria-hidden="true"
      className={`mx-auto w-full max-w-7xl px-6 md:px-20 ${tall ? "py-32" : "py-24"}`}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-2 w-24 bg-foreground/10" />
        <div className="h-10 w-2/3 max-w-md bg-foreground/10" />
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: lines }, (_, index) => (
            <div key={index} className="h-24 w-full bg-foreground/[0.06]" />
          ))}
        </div>
      </div>
    </section>
  );
}
