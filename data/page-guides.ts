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
    text: "Everything about me on one page: projects, services, experience and how to reach me. My path, my running and what people wrote are on the Journey page.",
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
    match: "/certificates",
    id: "certificates",
    title: "Certificates",
    text: "Every certificate, sorted by type. Tap the scan to see it full size, or open a card for every detail and the issuer's verification link.",
  },
  {
    match: "/certificates/*",
    id: "certificate",
    title: "One certificate",
    text: "The full scan, every detail printed on it, what it covers, and — where the issuer offers one — the link to verify it.",
  },
  {
    match: "/journey",
    id: "journey",
    title: "The journey",
    text: "My path year by year, the platforms I train on, what people I worked with wrote, and the track. Open any item for its own page with every detail.",
  },
  {
    match: "/journey/*",
    id: "journey-item",
    title: "One step of the journey",
    text: "Everything about it: the details, the roles behind it with every bullet, the certificates and the photos — each opens its own page.",
  },
  {
    match: "/gallery",
    id: "gallery",
    title: "Gallery",
    text: "Photos from my classes, the GDG bootcamp, the Banque Misr internship and my races — each says what it is, when and where. Tap one to see it full size.",
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
    title: "معرض الصور",
    text: "صور من محاضراتي ومعسكر GDG وتدريب بنك مصر وسباقاتي — مع كل صورة ما هي ومتى وأين. اضغط على أي صورة لتراها بالحجم الكامل.",
  },
  {
    match: "/ar/certificates",
    id: "ar-certificates",
    ar: true,
    title: "الشهادات",
    text: "كل شهاداتي مرتّبة حسب النوع. اضغط على الوثيقة لتراها بالحجم الكامل، أو افتح البطاقة لكل التفاصيل ورابط التحقق.",
  },
];

/** The note for an address, or undefined (the first entry that matches) */
export function guideFor(path: string): PageGuide | undefined {
  const clean = path.replace(/\/+$/, "") || "/";
  return PAGE_GUIDES.find((g) =>
    g.match.endsWith("/*") ? clean.startsWith(g.match.slice(0, -1)) && clean.length > g.match.length - 1 : clean === g.match,
  );
}
