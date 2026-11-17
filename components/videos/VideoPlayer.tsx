"use client";

/*
 * ═══ components/videos/VideoPlayer.tsx — the player on a video page ═══
 * Shows the video's thumbnail and a play button; the YouTube player (about
 * 1 MB of YouTube's scripts) loads only when the visitor presses play, and
 * then starts at once (autoplay). Until then the page loads nothing from
 * YouTube but one image. The blog's video cards work the same way
 * (components/blog/MediaSections.tsx).
 */

import { useState } from "react";
import { Play } from "lucide-react";
import { youtubeEmbed, youtubeThumb } from "@/lib/seo";

export default function VideoPlayer({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  /* If the thumbnail cannot load, show the dark box with the button, not a broken image */
  const [noThumb, setNoThumb] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`${youtubeEmbed(videoId)}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group/play absolute inset-0 block h-full w-full cursor-pointer"
      aria-label={`Play video: ${title}`}
    >
      {!noThumb && (
        /* eslint-disable-next-line @next/next/no-img-element -- a remote YouTube thumbnail, shown as is */
        <img
          src={youtubeThumb(videoId)}
          alt=""
          onError={() => setNoThumb(true)}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/play:scale-105"
        />
      )}
      <span className="absolute inset-0 bg-background/30 group-hover/play:bg-background/10 transition-colors duration-300" aria-hidden="true" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-mono text-[0.6875rem] font-black uppercase tracking-[0.2em] transition-transform duration-300 group-hover/play:scale-105">
        <Play size={14} fill="currentColor" aria-hidden="true" /> Play video
      </span>
    </button>
  );
}
