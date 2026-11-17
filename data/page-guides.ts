/*
 * ═══ data/page-guides.ts — the short "what's on this page" note ═══
 *
 * components/layout/PageGuide.tsx shows one small note, bottom left (bottom
 * right on Arabic pages), a moment after a page opens: what the page holds
 * and how to use it. Once per kind of page per browser.
 *
 * TO EDIT: change the text. TO ADD A PAGE: add a { match, … } entry —
 *   match → the page's address without /ahmed.dev: "/training", or ending
 *           in "/*" for every page under it: "/videos/*" (first match wins)
 *   id    → remembers it was shown; change it to show an edited note again
 *   ar    → true for an Arabic page (right to left)
 * A page without an entry shows no note.
 */

export type PageGuide = { match: string; id: string; title: string; text: string; ar?: boolean };

const PAGE_GUIDES: PageGuide[] = [
  {
    match: "/",
    id: "home",
    title: "Welcome",
    text: "Everything about me on one page: projects, services, experience, my running and how to reach me. Scroll down, or use the numbers on the right to jump.",
  },
  {
    match: "/blog",
    id: "blog",
    title: "The case library",
    text: "My investigations and labs. Search or filter them and open any case for the full report — plus the ATT&CK map, my detection rules and an alert you can triage yourself.",
  },
  {
    match: "/blog/*",
    id: "case",
    title: "One case, start to finish",
    text: "The goal and the result first, in plain words. Then the timeline, the evidence, the ATT&CK techniques and how to prevent it.",
  },
  {
    match: "/attack",
    id: "attack",
    title: "MITRE ATT&CK",
    text: "Every attacker technique my cases show, grouped by tactic. Open one to see the cases behind it.",
  },
  {
    match: "/attack/*",
    id: "technique",
    title: "One ATT&CK technique",
    text: "What it is, every case where it showed up, the tools that caught it and the techniques that came with it.",
  },
  {
    match: "/writeups/*",
    id: "writeups",
    title: "Platform write-ups",
    text: "Every write-up from this platform, newest first, with the topics, techniques and tools they cover.",
  },
  {
    match: "/videos",
    id: "videos",
    title: "My videos",
    text: "All my YouTube videos. Open one to watch it with a summary of what it covers and the key terms explained.",
  },
  {
    match: "/videos/*",
    id: "video",
    title: "One video",
    text: "Press Play to watch. Below it: what the video covers, the key terms in plain words and cases on the same topic.",
  },
  {
    match: "/teaching",
    id: "teaching",
    title: "Teaching",
    text: "What I teach at AMIT Learning and NTI: the diploma, the numbers and what my students wrote about it.",
  },
  {
    match: "/training",
    id: "training",
    title: "Training for your team",
    text: "Who it is for, three ways to take it, the diploma module by module — and a button that writes the request for you.",
  },
  {
    match: "/gallery",
    id: "gallery",
    title: "Certificates",
    text: "Every certificate and record, sorted by type. Tap one to see the scan, or verify it with the issuer. Photos from classes and events below.",
  },
  {
    match: "/cv",
    id: "cv",
    title: "My CV",
    text: "The same as the PDF, as a page you can read and search. The PDF download is at the top.",
  },
  {
    match: "/projects/*",
    id: "tool",
    title: "One of my tools",
    text: "What it does, how to install and run it, and a sample of what it prints. The code is on GitHub.",
  },
  {
    match: "/ar/teaching",
    id: "ar-teaching",
    ar: true,
    title: "التدريس",
    text: "ما أدرّسه في AMIT والمعهد القومي للاتصالات: الدبلومة والأرقام وآراء الطلاب.",
  },
  {
    match: "/ar/training",
    id: "ar-training",
    ar: true,
    title: "تدريب فريقك",
    text: "لمن هذا التدريب، وثلاث طرق لأخذه، ووحدات الدبلومة — وزر يكتب لك طلب التدريب.",
  },
  {
    match: "/ar/gallery",
    id: "ar-gallery",
    ar: true,
    title: "الشهادات",
    text: "كل شهاداتي ووثائقي مرتّبة حسب النوع. اضغط على أي واحدة لترى الوثيقة أو تتحقّق منها. وتحتها صور من المحاضرات والفعاليات.",
  },
];

/** The note for an address, or undefined (the first entry that matches) */
export function guideFor(path: string): PageGuide | undefined {
  const clean = path.replace(/\/+$/, "") || "/";
  return PAGE_GUIDES.find((g) =>
    g.match.endsWith("/*") ? clean.startsWith(g.match.slice(0, -1)) && clean.length > g.match.length - 1 : clean === g.match,
  );
}
