/* The certificate list as its own chunk (a client component, so its code is
   split out); the certificate pages mount it. Same pattern as
   components/gallery/dynamic.tsx. */

import dynamic from "next/dynamic";

export const CertificateList = dynamic(() => import("@/components/certificates/CertificateList"));
