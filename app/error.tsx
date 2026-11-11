"use client";

/* Route-level error boundary (app/error.tsx). Next keeps this file loaded on
   every page, so it is only a stub: the real error page (navbar, footer,
   message, retry) is components/layout/ErrorView.tsx, fetched only when an
   error actually happens. Edit the wording there. */

import dynamic from "next/dynamic";

const ErrorView = dynamic(() => import("@/components/layout/ErrorView"));

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView {...props} />;
}
