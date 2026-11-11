/*
 * Content-Security-Policy, delivered as a <meta> tag (layout.tsx) because
 * GitHub Pages cannot send response headers. Every origin the site really
 * loads from, and nothing else:
 *   · YouTube: the privacy-enhanced player and its thumbnails
 *   · GitHub: nothing — the contribution calendar is read at build time,
 *     so no API or image is loaded from GitHub in the browser
 *   · 'self' frames: the case pages show their own PDF reports inline
 * 'unsafe-inline' for scripts is required by Next.js static export (its
 * hydration data and the theme bootstrap are inline scripts with
 * no build-stable hash); everything else is locked down.
 *
 * ═══ IMPORTANT WHEN YOU ADD SOMETHING EXTERNAL ═══
 * The browser BLOCKS anything from a domain not listed below (in production).
 * If you add an image from another site, an embed (Vimeo, Google Maps…),
 * or fetch() from a new API and it silently doesn't show up, add its origin
 * to the right line:
 *   images  → img-src        fetch/API calls → connect-src
 *   iframes → frame-src      fonts           → font-src
 * The browser console (F12) shows a "Content Security Policy" error naming
 * what was blocked. Not active in `npm run dev`.
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'self' https://www.youtube-nocookie.com",
  "media-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");
