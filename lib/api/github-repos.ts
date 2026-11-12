/*
 * ═══ lib/api/github-repos.ts — the repositories behind the project cards ═══
 *
 * Runs at BUILD time only (npm run build), never in the visitor's browser.
 * Takes every project in data/portfolio-data.ts (`work`) that links to a
 * GitHub repository and adds its live star count, main language, licence and
 * homepage from the GitHub API. Offline or rate-limited → the same cards
 * without the live numbers, so the build never fails because of GitHub.
 *
 * Used by components/home/ProjectsGrid.tsx ("Open Source.", #projects).
 */

import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { GITHUB_USERNAME } from "@/lib/shared";

export interface RepoCard {
  name: string;
  title: string;
  description: string;
  url: string;
  homepage: string;
  stars: number;
  language: string;
  license: string;
  metrics: string[];
}

interface GithubRepoPayload {
  name: string;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  license?: { spdx_id: string } | null;
}

const slugOf = (url: string): string => (url.replace(/\/+$/, "").split("/").pop() ?? "").toLowerCase();

async function fetchRepos(): Promise<GithubRepoPayload[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=updated`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`GitHub API HTTP ${response.status}`);
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as GithubRepoPayload[]) : [];
  } catch (error) {
    console.warn(`[github-repos] live data unavailable, cards built without it: ${(error as Error).message}`);
    return [];
  }
}

export async function getRepoCards(): Promise<RepoCard[]> {
  const live = new Map((await fetchRepos()).map((r) => [r.name.toLowerCase(), r]));
  return PORTFOLIO_DATA.work
    .filter((w) => w.links.github)
    .map((w) => {
      const url = w.links.github!;
      const repo = live.get(slugOf(url));
      const license = repo?.license?.spdx_id;
      return {
        name: slugOf(url),
        title: w.title,
        description: w.tagline,
        url: repo?.html_url ?? url,
        homepage: (repo?.homepage ?? "").trim(),
        stars: Number(repo?.stargazers_count ?? 0),
        language: repo?.language ?? "",
        license: license && license !== "NOASSERTION" ? license : "",
        metrics: w.metrics.slice(0, 2),
      };
    });
}
