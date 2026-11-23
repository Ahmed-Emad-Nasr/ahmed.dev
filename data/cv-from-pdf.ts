/*
 * data/cv-from-pdf.ts — written by scripts/sync-cv.mjs; don't edit by hand.
 *
 * What the CV PDF (public/Assets/cv/AhmedEmadNasr_CV.pdf) says, read every
 * time the PDF changes. data/cv.ts (the /cv page), data/experience.ts (the
 * home Experience section and the JSON-LD) and data/profile.ts (phone and
 * e-mail) take it over their own hand-written values. A section the script
 * could not read with confidence is left out here, so the hand-written one
 * (or the last good reading) stays. null = not read yet.
 */

export type CvFromPdfEntry = { title: string; org: string; place: string; dates: string; points: string[] };

export interface CvFromPdf {
  /** sha256 of the PDF this was read from */
  hash: string;
  /** The day it was read */
  read: string;
  /** In this CV's layout the first heading line of an entry is the job title (true) or the organisation (false) */
  titleFirst: boolean;
  sections: {
    headline?: string;
    contact?: { phone?: string; email?: string; linkedin?: string; github?: string; wuzzuf?: string };
    education?: { degree: string; school: string; place: string; date: string; gpa: string; coursework: string };
    experience?: CvFromPdfEntry[];
    projects?: { title: string; stack: string; github?: string; demo?: string; points: string[] }[];
    skills?: [string, string][];
    certifications?: [string, string, string][];
    volunteering?: CvFromPdfEntry[];
    awards?: string[];
    languages?: [string, string][];
  };
}

export const CV_FROM_PDF: CvFromPdf | null = null;
