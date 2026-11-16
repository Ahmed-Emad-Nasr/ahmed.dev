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
export const GALLERY_URL = absoluteUrl("/gallery");
export const GALLERY_ID = `${GALLERY_URL}#gallery`;
