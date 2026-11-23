/*
 * data/live-stats.ts — written by scripts/sync-stats.mjs; don't edit by hand
 * (except to correct a number until the next sync).
 *
 * Every morning GitHub Actions (.github/workflows/nextjs.yml) reads:
 *   youtube    → subscribers, total views and uploads of the channel
 *   playlists  → every playlist of the channel with its real id and size
 *   tryhackme  → the TryHackMe profile numbers (the fallback of the live card)
 * and commits this file back. Whatever could not be read keeps its last value.
 * The site reads it through AUDIENCE (lib/shared.ts), data/youtube.ts and
 * data/platforms.ts.
 */

export interface LivePlaylist {
  id: string;
  title: string;
  description: string;
  count: number;
}

export interface LiveStats {
  /** The last day at least one number was read */
  checked: string;
  youtube: { subscribers: number; views: number; videos: number };
  playlists: LivePlaylist[];
  tryhackme: {
    rank: number;
    topPercentage: number;
    level: number;
    completedRoomsNumber: number;
    badgesNumber: number;
    totalPoints: number;
    /** The date these numbers were read */
    asOf: string;
  };
}

export const LIVE_STATS: LiveStats = {
  "checked": "2026-11-23",
  "youtube": {
    "subscribers": 610,
    "views": 60000,
    "videos": 86
  },
  "playlists": [],
  "tryhackme": {
    "rank": 10427,
    "topPercentage": 1,
    "level": 14,
    "completedRoomsNumber": 315,
    "badgesNumber": 51,
    "totalPoints": 35179,
    "asOf": "2026-10-22"
  }
};
