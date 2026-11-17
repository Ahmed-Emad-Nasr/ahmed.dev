/*
 * ═══ lib/api/github-repos.ts — the repositories behind the project cards ═══
 *
 * Runs at BUILD time only (npm run build), never in the visitor's browser.
 * Takes every project in data/portfolio-data.ts (`work`) that links to a
 * GitHub repository and adds its live star count, main language, licence and
 * homepage from the GitHub API. Offline or rate-limited → the same cards
 * without the live numbers, so the build never fails because of GitHub.
 *
 * Shown on the project cards (components/home/WorkShowcase.tsx, #work: stars,
 * language, licence) and listed for Google in app/page.tsx.
 *
 * The same one request also finds NEW repositories: every public repo that
 * is not a project card (and not a fork, archived, the profile README, the
 * github.io site or in HIDDEN_REPOS) becomes a row of "More on GitHub" under
 * the projects (getMoreRepos). The site rebuilds every morning (GitHub
 * Actions), so a repo made today is on the site tomorrow — no code change.
 * To turn one into a full project card, add it to `work` in
 * data/portfolio-data.ts; it then leaves the list by itself.
 *
 * In GitHub Actions the request carries the workflow's own GITHUB_TOKEN
 * (1,000 requests an hour instead of 60 shared), so it is not rate-limited.
 */

import { HIDDEN_REPOS, PORTFOLIO_DATA } from "@/data/portfolio-data";
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

/** A public repository that has no project card yet ("More on GitHub") */
export interface MoreRepo {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
}

interface GithubRepoPayload {
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  license?: { spdx_id: string } | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

/** What a project card shows from its repository, keyed by project title */
export type RepoFacts = Record<string, { stars: number; language: string; license: string }>;

/** Only the three facts the cards show, for the projects that have any —
    the rest of RepoCard stays on the server */
export const repoFacts = (repos: RepoCard[]): RepoFacts =>
  Object.fromEntries(
    repos
      .filter((r) => r.stars > 0 || r.language || r.license)
      .map((r) => [r.title, { stars: r.stars, language: r.language, license: r.license }]),
  );

const slugOf = (url: string): string => (url.replace(/\/+$/, "").split("/").pop() ?? "").toLowerCase();

/* One request per build, shared by the project cards and "More on GitHub" */
let pending: Promise<GithubRepoPayload[]> | null = null;
const fetchRepos = (): Promise<GithubRepoPayload[]> => (pending ??= requestRepos());

async function requestRepos(): Promise<GithubRepoPayload[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    /* GITHUB_API: only to test against a saved copy of the API's answer */
    const api = process.env.GITHUB_API ?? "https://api.github.com";
    const response = await fetch(`${api}/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=pushed`, {
      headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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

/* Never listed: the profile README repo and the github.io site */
const isSiteRepo = (name: string) =>
  name.toLowerCase() === GITHUB_USERNAME.toLowerCase() || name.toLowerCase().endsWith(".github.io");

/** Public repositories with no project card yet, most recently worked on first.
    Empty when GitHub cannot be reached — the list is then simply not shown. */
export async function getMoreRepos(): Promise<MoreRepo[]> {
  const carded = new Set(
    PORTFOLIO_DATA.work.flatMap((w) => (w.links.github ? [slugOf(w.links.github)] : [])),
  );
  const hidden = new Set(HIDDEN_REPOS.map((n) => n.toLowerCase()));
  return (await fetchRepos())
    .filter((r) => !r.fork && !r.archived && !isSiteRepo(r.name))
    .filter((r) => !carded.has(r.name.toLowerCase()) && !hidden.has(r.name.toLowerCase()))
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
    .map((r) => ({
      name: r.name,
      description: (r.description ?? "").trim(),
      url: r.html_url,
      language: r.language ?? "",
      stars: Number(r.stargazers_count ?? 0),
    }));
}
