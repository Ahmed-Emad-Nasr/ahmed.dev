/*
 * ═══ data/credly-badges.ts — written by scripts/sync-credly.mjs ═══
 *
 * The Credly badges that are not otherwise on the site, read from the public
 * profile credly.com/users/ahmed-emad-nasr on every deploy. data/certificates.ts
 * adds them to the list. Edit by hand only to remove one; the next sync
 * never re-adds a badge that is listed in data/certificates.ts.
 */

import type { Certificate } from "@/data/certificates";

export const CREDLY_BADGES: readonly Certificate[] = /* DATA */[];
