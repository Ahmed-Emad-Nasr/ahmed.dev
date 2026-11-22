/*
 * ═══ components/videos/VideoPlayer.tsx — the player on a video page ═══
 * The real YouTube player, in the page's HTML from the start. A watch page
 * must not need a click to show its video: Google's rule is "don't rely on
 * user actions (such as swiping, clicking, or typing) to load the video",
 * and with only a thumbnail + Play button Search Console reported the
 * videos as not indexed. (The blog's video cards keep the thumbnail-first
 * player — a list of many videos is not a watch page anyway:
 * components/blog/MediaSections.tsx.)
 *
 * youtube-nocookie: no YouTube cookies until the visitor presses play
 * (allowed in lib/security.ts → frame-src).
 */

import { youtubeEmbed } from "@/lib/seo";

export default function VideoPlayer({ videoId, title }: { videoId: string; title: string }) {
  return (
    <iframe
      src={youtubeEmbed(videoId)}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      className="absolute inset-0 h-full w-full"
    />
  );
}
