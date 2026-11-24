/*
 * data/contributions.ts — the open-source contribution cards (#contributions
 * on the home page) and the spoken languages of the contact section.
 *
 * Small on purpose: both sections run in the browser, so they import this
 * file rather than PORTFOLIO_DATA (data/portfolio-data.ts, which re-uses
 * these) — that one would bring the whole experience and project lists.
 * To add a contribution: copy an entry below (name, org, description, link).
 */

import type { Contribution, Language } from "@/data/types";
import { languages } from "@/data/languages";
import { AUDIENCE, AUDIENCE_LABEL, fullCount, YOUTUBE_CHANNEL_URL } from "@/lib/shared";

export const CONTRIBUTIONS: Contribution[] = [
  {
    name: "SOC Fortress",
    org: "Wazuh rules",
    description: "A custom Wazuh detection rule, reviewed and merged by the maintainers of the open-source SOC Fortress ruleset.",
    link: "https://github.com/socfortress/Wazuh-Rules",
  },
  {
    name: "GDG CTF",
    org: "Google Developer Groups",
    description: "Co-designed 10+ CTF challenges and delivered 35+ security sessions to 120+ learners.",
    link: "https://gdg.community.dev/",
  },
  {
    name: "YouTube",
    org: "Community",
    description: `Free cybersecurity walkthroughs — ${AUDIENCE_LABEL.youtubeSubscribers} subscribers and ${fullCount(AUDIENCE.youtubeViews)} views so far.`,
    link: YOUTUBE_CHANNEL_URL,
  },
];

export const SPOKEN_LANGUAGES: Language[] = languages.map((l) => ({ code: l.code, name: l.name, level: l.short }));
