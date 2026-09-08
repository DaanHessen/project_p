import { useEffect, useState } from "react";

const USER = "DaanHessen";
const ENDPOINT = `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`;

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updated: string;
}

export interface RepoStats {
  stars: number;
  forks: number;
}

export const INITIAL_PROJECT_STATS: Record<string, RepoStats> = {
  "ascii-blobs": { stars: 2, forks: 1 },
  "earctl": { stars: 4, forks: 1 },
  "nvim-docx": { stars: 7, forks: 2 },
};

/**
 * The topic a repo must carry to appear on the CV.
 *
 * Sorting by "most recently pushed" and taking the top few puts dotfiles, a
 * dead portfolio repo and a notes dump next to real work. Opting in by topic
 * keeps the section genuinely live — tag a repo on GitHub and it shows up on
 * the next page load, no deploy — while leaving the choice of what counts as
 * portfolio work with a human.
 */
export const FEATURE_TOPIC = "portfolio";

/** Shape of the fields we read off the GitHub API. */
interface ApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count?: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
}

export function toStatsMap(raw: ApiRepo[]): Record<string, RepoStats> {
  const map: Record<string, RepoStats> = {};
  for (const repo of raw) {
    const stats: RepoStats = {
      stars: repo.stargazers_count,
      forks: repo.forks_count ?? 0,
    };
    map[repo.name.toLowerCase()] = stats;
    map[repo.html_url.toLowerCase()] = stats;
  }
  return map;
}

export function toRepos(raw: ApiRepo[], exclude: string[]): Repo[] {
  const skip = new Set(exclude.map((url) => url.toLowerCase()));

  return raw
    .filter((repo) => !repo.fork && !repo.archived)
    .filter((repo) => (repo.topics ?? []).includes(FEATURE_TOPIC))
    // Anything already written up by hand in the projects section says more
    // than its repo blurb would, so it is not repeated here.
    .filter((repo) => !skip.has(repo.html_url.toLowerCase()))
    .filter((repo) => repo.description !== null)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        b.pushed_at.localeCompare(a.pushed_at),
    )
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count ?? 0,
      updated: repo.pushed_at,
    }));
}

/**
 * Live repositories and project stats, fetched in the browser.
 *
 * Deliberately silent on failure: GitHub rate-limits unauthenticated calls to
 * 60 an hour per IP, and a CV that renders an error box because a third party
 * is throttling is worse than one that simply shows the hand-written projects
 * above it. Initial known stats are used as fallbacks if the request is throttled.
 */
export function useGitHubRepos(exclude: string[]): {
  repos: Repo[];
  stats: Record<string, RepoStats>;
} {
  const [data, setData] = useState<{
    repos: Repo[];
    stats: Record<string, RepoStats>;
  }>({
    repos: [],
    stats: INITIAL_PROJECT_STATS,
  });

  useEffect(() => {
    let live = true;

    fetch(ENDPOINT, { headers: { Accept: "application/vnd.github+json" } })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((raw: ApiRepo[]) => {
        if (live) {
          setData({
            repos: toRepos(raw, exclude),
            stats: { ...INITIAL_PROJECT_STATS, ...toStatsMap(raw) },
          });
        }
      })
      .catch(() => {
        /* leave the section empty */
      });

    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exclude.join("|")]);

  return data;
}
