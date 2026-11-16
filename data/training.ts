/*
 * ═══ data/training.ts — the words of the training pages ═══
 *
 *   TRAINING_EN → /training          (app/training/page.tsx)
 *   TRAINING_AR → /ar/training       (app/ar/training/page.tsx)
 *
 * Both pages are drawn by components/training/TrainingContent.tsx. The
 * diploma itself (modules, hours, what each session ends with) comes from
 * data/teaching.ts and data/teaching-ar.ts, and the request e-mail from their
 * `cta` — so a change there shows here too. A change to one language here
 * should be made in the other as well.
 */

import { DIPLOMA, TEACHING_EN, TEACHING_STATS } from "@/data/teaching";
import { TEACHING_AR } from "@/data/teaching-ar";

export type TrainingCopy = {
  lang: "en" | "ar";
  /** <title> and meta description */
  title: string;
  description: string;
  eyebrow: string;
  titleA: string;
  titleB: string;
  lead: string;
  back: { href: string; label: string; current: string };
  /** The link to the same page in the other language */
  switchLang: { href: string; label: string; hrefLang: "en" | "ar" };
  stats: { value: string; label: string }[];
  audiencesTitle: string;
  /** In the order of the icons in TrainingContent: company, university, centre, career changer */
  audiences: { title: string; text: string }[];
  formatsTitle: string;
  formats: { title: string; detail: string; text: string }[];
  diploma: typeof DIPLOMA;
  hoursLabel: string;
  moduleLabel: string;
  sessionEndsWith: string;
  quotesTitle: string;
  allReviews: (n: number) => string;
  reviewsHref: string;
  cta: { eyebrow: string; title: string; text: string; button: string; subject: string; body: string };
};

export const TRAINING_EN: TrainingCopy = {
  lang: "en",
  title: "Cybersecurity & SOC Training for Teams — Ahmed Emad Nasr",
  description: `Book the ${DIPLOMA.hours}-hour SOC & Cybersecurity Diploma — or any module of it — for a company SOC team, a university or a training centre. Hands-on labs every session, in English or Arabic, on site in Cairo or Benha, or online. Taught by Ahmed Emad Nasr, instructor at AMIT Learning and NTI.`,
  eyebrow: "Ahmed Emad Nasr // Training",
  titleA: "Train Your",
  titleB: "Team.",
  lead: `The SOC & Cybersecurity Diploma I wrote and teach at AMIT Learning and NTI — ${DIPLOMA.hours} hours, a hands-on lab after every session — for your company, university or training centre. The whole diploma or one module, in English or Arabic, on site in Cairo or Benha, or online.`,
  back: { href: "/teaching", label: "Teaching", current: "Training for teams" },
  switchLang: { href: "/ar/training", label: "اقرأ هذه الصفحة بالعربية", hrefLang: "ar" },
  stats: [
    { value: TEACHING_STATS[0].value, label: "Students taught" },
    { value: TEACHING_STATS[1].value, label: "Written testimonials" },
  ],
  audiencesTitle: "Who it is for",
  audiences: [
    { title: "Company SOC & IT teams", text: "New analysts brought up to speed, or a team moving to a SIEM: alert triage, incident handling and detection on your own stack." },
    { title: "Universities", text: "A practical track next to the theory, so graduates can sit in a SOC from day one." },
    { title: "Training centres", text: "The whole diploma, ready to run: slides, labs, quizzes and a capstone for every cohort." },
    { title: "Career changers", text: "A clear path from networking and Linux to working SOC alerts, with a lab after every session." },
  ],
  formatsTitle: "Three ways to take it",
  formats: [
    { title: "The full diploma", detail: `${DIPLOMA.hours} hours`, text: "All six modules in order, from networking foundations to a capstone SOC lab on a live SIEM." },
    { title: "One module", detail: "6–12 sessions", text: "Just the part your team needs — Security+, offensive and web testing, SANS SEC450 / SEC504, or SIEM." },
    { title: "A workshop", detail: "1–3 days", text: "A short hands-on bootcamp on one topic: alert triage, phishing analysis, Wazuh or Splunk." },
  ],
  diploma: DIPLOMA,
  hoursLabel: "hours",
  moduleLabel: "Module",
  sessionEndsWith: "Every session ends with",
  quotesTitle: "What students said",
  allReviews: (n) => `All ${n} student reviews`,
  reviewsHref: "/teaching#student-feedback",
  cta: {
    ...TEACHING_EN.ui.cta,
    text: "Tell me the organisation, the topic, how many trainees and their level, and the dates — the button opens your mail app with those questions ready.",
  },
};

export const TRAINING_AR: TrainingCopy = {
  lang: "ar",
  title: "تدريب أمن سيبراني و SOC للشركات والفرق — أحمد عماد نصر",
  description: `دبلومة SOC والأمن السيبراني (${DIPLOMA.hours} ساعة) أو أي وحدة منها، لفريق SOC في شركة أو جامعة أو مركز تدريب. لاب عملي بعد كل محاضرة، بالعربية أو الإنجليزية، حضوريًا في القاهرة أو بنها أو أونلاين. يقدّمها أحمد عماد نصر، مدرب في AMIT والمعهد القومي للاتصالات (NTI).`,
  eyebrow: "أحمد عماد نصر // التدريب",
  titleA: "درّب",
  titleB: "فريقك.",
  lead: `دبلومة SOC والأمن السيبراني التي كتبتها وأدرّسها في AMIT والمعهد القومي للاتصالات — ${DIPLOMA.hours} ساعة، ولاب عملي بعد كل محاضرة — لشركتك أو جامعتك أو مركز التدريب. الدبلومة كاملة أو وحدة واحدة، بالعربية أو الإنجليزية، حضوريًا في القاهرة أو بنها، أو أونلاين.`,
  back: { href: "/ar/teaching", label: "التدريس", current: "تدريب الفرق" },
  switchLang: { href: "/training", label: "Read this page in English", hrefLang: "en" },
  stats: [
    { value: TEACHING_STATS[0].value, label: "متدرب" },
    { value: TEACHING_STATS[1].value, label: "رأي مكتوب" },
  ],
  audiencesTitle: "لمن هذا التدريب",
  audiences: [
    { title: "فرق SOC و IT في الشركات", text: "تأهيل محللين جدد بسرعة، أو فريق ينتقل إلى SIEM: فرز التنبيهات والتعامل مع الحوادث والاكتشاف على أنظمتكم أنتم." },
    { title: "الجامعات", text: "مسار عملي بجانب النظري، ليبدأ الخريج العمل في SOC من أول يوم." },
    { title: "مراكز التدريب", text: "الدبلومة كاملة وجاهزة للتشغيل: شرائح ولابات واختبارات ومشروع ختامي لكل دفعة." },
    { title: "من يغيّر مساره المهني", text: "طريق واضح من الشبكات و Linux حتى العمل على تنبيهات SOC حقيقية، مع لاب بعد كل محاضرة." },
  ],
  formatsTitle: "ثلاث طرق للتدريب",
  formats: [
    { title: "الدبلومة كاملة", detail: `${DIPLOMA.hours} ساعة`, text: "الوحدات الست بالترتيب، من أساسيات الشبكات حتى لاب SOC ختامي على SIEM حقيقي." },
    { title: "وحدة واحدة", detail: "6–12 محاضرة", text: "الجزء الذي يحتاجه فريقك فقط — Security+ أو الاختبار الهجومي والويب أو SANS SEC450 / SEC504 أو SIEM." },
    { title: "ورشة عمل", detail: "1–3 أيام", text: "معسكر عملي قصير في موضوع واحد: فرز التنبيهات أو تحليل التصيّد أو Wazuh أو Splunk." },
  ],
  diploma: TEACHING_AR.diploma,
  hoursLabel: "ساعة",
  moduleLabel: "الوحدة",
  sessionEndsWith: "كل محاضرة تنتهي بـ",
  quotesTitle: "ماذا قال الطلاب",
  allReviews: (n) => `كل آراء الطلاب (${n})`,
  reviewsHref: "/ar/teaching#student-feedback",
  cta: {
    ...TEACHING_AR.ui.cta,
    text: "اكتب اسم الجهة والموضوع وعدد المتدربين ومستواهم والمواعيد — الزر يفتح بريدك والأسئلة جاهزة.",
  },
};
