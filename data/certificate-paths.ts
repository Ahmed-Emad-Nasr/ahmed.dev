/*
 * data/certificate-paths.ts — the address of a certificate's own page.
 *
 * Its own file so code that only needs the link (data/portfolio-data.ts,
 * which runs in the browser) does not load the whole certificate list with
 * it. data/certificates.ts re-exports it.
 */

export const certificatePagePath = (slug: string): string => `/certificates/${slug}`;
