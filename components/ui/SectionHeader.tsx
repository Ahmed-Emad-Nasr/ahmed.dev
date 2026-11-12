/*
 * ═══ components/ui/SectionHeader.tsx — the big two-line section title ═══
 * Usage:  <SectionHeader titleA="Built &" titleB="Tested." description="…" />
 *   titleA      → first line (white/black)
 *   titleB      → second line (red, italic)
 *   description → optional grey paragraph under it
 *   as="h1"     → when it's the page's main title (default h2)
 * Slides in from the left when it scrolls into view.
 */


interface SectionHeaderProps {
  titleA: string;
  titleB: string;
  description?: string;
  /** h1 on pages where this is the page title (case library, CV …) */
  as?: "h1" | "h2";
}

export default function SectionHeader({
  titleA,
  titleB,
  description,
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div className="mb-16 md:mb-20 max-w-3xl">
      <Heading className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
        <span className="text-foreground">{titleA}</span> <br />
        <span className="text-primary italic">{titleB}</span>
      </Heading>
      {description ? (
        <p className="mt-5 text-base md:text-lg text-foreground/60 font-light leading-relaxed max-w-2xl">
          {description}
        </p>
      ) : null}
    </div>
  );
}
