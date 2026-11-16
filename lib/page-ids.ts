/*
 * lib/page-ids.ts — the address of each page and its JSON-LD @id, in one
 * place, so a page and the pages that point at it (the home page's
 * ProfilePage lists the blog and the gallery) always agree.
 */

import { absoluteUrl } from "@/lib/site";

export const BLOG_URL = absoluteUrl("/blog");
export const BLOG_ID = `${BLOG_URL}#blog`;
export const TEACHING_URL = absoluteUrl("/teaching");
export const TEACHING_ID = `${TEACHING_URL}#teaching`;
export const CV_URL = absoluteUrl("/cv");
export const CV_ID = `${CV_URL}#cv`;
export const VIDEOS_URL = absoluteUrl("/videos");
export const VIDEOS_ID = `${VIDEOS_URL}#videos`;
export const TEACHING_AR_URL = absoluteUrl("/ar/teaching");
export const TEACHING_AR_ID = `${TEACHING_AR_URL}#teaching`;
/* The teaching page in both languages (hreflang): each page lists both */
export const TEACHING_LANGUAGES = { en: "/teaching", ar: "/ar/teaching", "x-default": "/teaching" };
export const GALLERY_URL = absoluteUrl("/gallery");
export const GALLERY_ID = `${GALLERY_URL}#gallery`;
