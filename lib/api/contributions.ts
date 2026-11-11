/*
 * ═══ lib/api/contributions.ts — the GitHub contribution calendar ═══
 *
 * Read once at BUILD time (app/blog/page.tsx), like the TryHackMe stats:
 * visitors' browsers never call a third-party API, and the Content-Security-
 * Policy (lib/security.ts) does not have to allow one. The monthly rebuild
 * (.github/workflows/nextjs.yml) keeps it fresh; `asOf` is the build date.
 *
 * Source: github-contributions-api.jogruber.de (GitHub's public calendar,
 * no token needed). Offline or failing → status "error", and the section
 * shows a link to the GitHub profile instead of the graph.
 */

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionStats {
  status: "ready" | "empty" | "error";
  days: ContributionDay[];
  total: number;
  /** Build date, "YYYY-MM-DD" */
  asOf: string;
}

const isDay = (d: unknown): d is ContributionDay =>
  !!d &&
  typeof (d as ContributionDay).date === "string" &&
  Number.isFinite((d as ContributionDay).count) &&
  Number.isFinite((d as ContributionDay).level);

/** Last-year GitHub contributions — the latest 26 weeks are drawn */
export async function getContributionStats(username: string): Promise<ContributionStats> {
  const asOf = new Date().toISOString().slice(0, 10);
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: { contributions?: unknown; total?: { lastYear?: unknown } } = await response.json();
    const list = Array.isArray(data?.contributions) ? data.contributions.filter(isDay) : [];
    if (list.length === 0) return { status: "empty", days: [], total: 0, asOf };
    const total = Number(data?.total?.lastYear);
    return {
      status: "ready",
      days: list.slice(-182),
      total: Number.isFinite(total) ? total : list.reduce((s, d) => s + d.count, 0),
      asOf,
    };
  } catch (error) {
    console.warn("GitHub contributions unavailable at build time:", error instanceof Error ? error.message : error);
    return { status: "error", days: [], total: 0, asOf };
  }
}
