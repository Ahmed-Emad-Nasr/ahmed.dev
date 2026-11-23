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
    "subscribers": 612,
    "views": 40517,
    "videos": 86
  },
  "playlists": [
    {
      "id": "PLWgsM4fK9Xls",
      "title": "Cybersecurity Basics",
      "description": "مصطلحات Cybersecurity ببساطة | Cybersecurity Terms Explained\n\nفي الـPlaylist دي هنتكلم عن أهم **Cybersecurity Terms & Concepts** اللي لازم تكون فاهمها لو بتبدأ أو بتطور نفسك في مجال الـCybersecurity.\n\nكل فيديو بيركز على **مصطلح أو Concept مهم**، وبيشرحه بطريقة بسيطة وعملية، مع توضيح معناه، بيستخدم فين، وليه مهم في عالم الـCybersecurity.\n\nهنتكلم عن مواضيع ومص",
      "count": 22
    },
    {
      "id": "PLPDYYur6-Ax4",
      "title": "VerifAI360 Complaince Framework",
      "description": "",
      "count": 1
    },
    {
      "id": "PLLzq933rD6WE",
      "title": "SOC Environment",
      "description": "",
      "count": 10
    },
    {
      "id": "PLcw8B9lEwARs",
      "title": "Enterprise Vulnerability Assessment & Attack Lifecycle Simulation",
      "description": "penetration testing And Threat Emulation Training , Enterprise Vulnerability Assessment & Attack Lifecycle Simulation Project",
      "count": 18
    },
    {
      "id": "PLO1VSSKnwZUgGaiDZXU-mKuh8CUZx-gAd",
      "title": "Malware Analysis",
      "description": "My Malware Analysis Project",
      "count": 11
    },
    {
      "id": "PLO1VSSKnwZUgbiE0ev1TUr5wPI9kxxbgL",
      "title": "Wazuh.",
      "description": "",
      "count": 14
    },
    {
      "id": "PLO1VSSKnwZUgdrITjagQD0mikt6Xk64yX",
      "title": "Wazuh Threat Emulation",
      "description": "Depi Project & All Proof Of Concept Of Wazuh. and Threat Emulation",
      "count": 16
    }
  ],
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
