/* The Arabic teaching page (/ar/teaching) — the same content as
   data/teaching.ts, in Arabic.

   ═══ data/teaching-ar.ts → app/ar/teaching/page.tsx ═══
   Same shape as TEACHING_EN (data/teaching.ts). When you change the English
   (a new module, a new place you taught, a new number), change it here too.
   `org` stays in English: it is the key of the organisation's logo — the
   Arabic name goes in `orgLabel`. */

import { YOUTUBE_CHANNEL_URL } from "@/lib/shared";
import { TESTIMONIALS } from "@/data/testimonials";
import { DIPLOMA, type TeachingContent } from "@/data/teaching";

export const TEACHING_AR: TeachingContent = {
  lang: "ar",
  stats: [
    { value: "300+", label: "متدرب في AMIT و NTI", japanese: "受講生" },
    { value: String(TESTIMONIALS.length), label: "رأي مكتوب", japanese: "推薦" },
    { value: "الأول", label: "من بين 250 مدربًا · GDG", japanese: "首位" },
    { value: "60K+", label: "مشاهدة على يوتيوب", japanese: "視聴" },
  ],
  diploma: {
    title: "دبلومة SOC والأمن السيبراني",
    japanese: DIPLOMA.japanese,
    hours: DIPLOMA.hours,
    summary:
      "مسار عملي كامل مدته 160 ساعة: من أساسيات الشبكات وأنظمة التشغيل، إلى اختبار الاختراق، والتعامل مع الحوادث الأمنية، وتحليل تنبيهات SIEM داخل مركز عمليات أمنية (SOC) حقيقي. كتبته ودرّسته كمسار واحد متصل، وبعد كل محاضرة لاب عملي.",
    modules: [
      { n: "01", title: "أساسيات الشبكات (CCNA) — TCP/IP و VLANs و OSPF و ACLs و NAT وتحليل الحزم", detail: "8 محاضرات" },
      { n: "02", title: "إدارة Linux و Windows (RH124/RH134) — الصلاحيات والخدمات والتأمين و Sysmon/auditd", detail: "6 محاضرات" },
      { n: "03", title: "\u2066CompTIA Security+\u2069 — التشفير و IAM/PAM وأمن السحابة وإدارة الثغرات و GRC", detail: "12 محاضرة" },
      { n: "04", title: "الأمن الهجومي واختبار اختراق الويب (eJPT / OWASP Top 10) — الاستطلاع و Burp Suite و SQLi و XSS والـ Pivoting", detail: "8 محاضرات" },
      { n: "05", title: "SANS SEC450 و SEC504 — بنية الـ SOC والاستجابة للحوادث وفق NIST 800-61 والتحليل الجنائي للذاكرة والأقراص وفرز البرمجيات الخبيثة", detail: "8 محاضرات" },
      { n: "06", title: "SIEM وهندسة الاكتشاف — Splunk SPL و IBM QRadar وقواعد Wazuh المخصصة ولاب SOC ختامي", detail: "لابات + مشروع ختامي" },
    ],
    format: ["شرائح ومذكرة منظمة", "أهم المصطلحات الأمنية", "لاب عملي موجَّه", "تقييم عملي واختبار قصير"],
  },
  roles: [
    {
      org: "AMIT Learning",
      role: "مدرب أمن سيبراني",
      period: "حاليًا",
      link: "https://amit-learning.com/",
      topics:
        "أكتب وأدرّس مسار الأمن السيبراني (160 ساعة): شبكات CCNA، و Red Hat Linux (RH124/RH134)، و \u2066CompTIA Security+\u2069، و SANS SEC450/SEC504، ولابات SIEM على Splunk و QRadar و Wazuh، واختبار اختراق الويب، و IAM، و GRC.",
      results: ["مسار 160 ساعة", "دفعات Red Hat RH124/RH134", "آراء الطلاب"],
    },
    {
      org: "National Telecommunication Institute (NTI)",
      orgLabel: "المعهد القومي للاتصالات (NTI)",
      role: "مدرب أمن سيبراني",
      period: "حاليًا",
      link: "https://nti.sci.eg/",
      topics:
        "تدريب عملي مكثف في إدارة أنظمة Linux، وشبكات المؤسسات، وعمليات الـ SOC، وفرز التنبيهات، واختبار اختراق الويب والشبكات.",
      results: ["أكثر من 42 متدربًا", "نسبة نجاح تتجاوز 85%", "أكثر من 120 ساعة لابات"],
    },
    {
      org: "iSchool",
      role: "مساعد مدرب ومنسق لابات",
      period: "حاليًا",
      link: "https://ischool-tech.com/",
      topics: "إدارة الشرح العملي في اللابات، ومتابعة الطلاب، وتنظيم المحاضرات في مبادرات DEPI و DECI للبرمجة والتكنولوجيا.",
      results: ["أكثر من 470 طالبًا", "دفعات DEPI و DECI"],
    },
    {
      org: "Google Developer Groups (GDG)",
      role: "مدرب أمن سيبراني ومصمم تحديات CTF",
      period: "2024 – 2025",
      link: "https://gdg.community.dev/",
      topics: "ورش منظمة في أمن الشبكات و Linux وثغرات الويب وأساسيات الـ Blue Team، وتصميم تحديات CTF للجامعات.",
      results: ["أكثر من 35 جلسة", "أكثر من 120 متعلمًا", "الأول من 250 مدربًا", "أكثر من 10 تحديات CTF"],
    },
    {
      org: "IEEE Benha",
      orgLabel: "IEEE بنها",
      role: "مدرب تقني",
      period: "2023",
      link: "https://www.ieee.org/",
      topics: "تدريس البرمجة بلغتي C و Python، والإشراف على فرق طلابية تبني سيارات روبوتية ذاتية القيادة بـ Arduino.",
      results: ["أكثر من 5 فرق", "أكثر من 20 طالبًا", "المركز الثاني في IEEE GHOSTEC"],
    },
    {
      org: "YouTube — @AhmedEmad-0x3omda",
      /* \u2066…\u2069 keep "@handle" in one piece inside the Arabic line */
      orgLabel: "يوتيوب — \u2066@AhmedEmad-0x3omda\u2069",
      role: "صانع محتوى — شروحات ولابات أمنية",
      period: "مستمر",
      link: YOUTUBE_CHANNEL_URL,
      topics: "شروحات خطوة بخطوة: تنصيب Wazuh SIEM، ومحاكاة SOC على TryHackMe، وتحليل WannaCry وملفات PDF الخبيثة، و Burp Suite، وأساسيات GRC.",
      results: ["أكثر من 500 مشترك", "أكثر من 60,000 مشاهدة", "أكثر من 25 فيديو"],
    },
  ],
  ui: {
    eyebrow: "أحمد عماد نصر // مدرب أمن سيبراني",
    titleA: "انقل",
    titleB: "الخبرة.",
    description:
      "أدرّس الأمن السيبراني كما أمارسه. هنا تجد الدبلومة الكاملة التي كتبتها، وما تغطيه كل وحدة، والأماكن التي درّستها فيها — والنتائج.",
    hoursChip: { value: `${DIPLOMA.hours}`, label: "ساعة منهج كتبتها" },
    curriculumLabel: `المنهج // ${DIPLOMA.hours} ساعة`,
    moduleLabel: "الوحدة",
    sessionEndsWith: "كل محاضرة تنتهي بـ",
    now: "حاليًا",
    cta: {
      eyebrow: "تدريب // لفريقك",
      title: "تريد هذا التدريب لفريقك؟",
      text: "الدبلومة كاملة أو أي وحدة منها — لفريق SOC في شركة، أو جامعة، أو مركز تدريب. بالعربية أو الإنجليزية، حضوريًا في القاهرة أو بنها، أو أونلاين.",
      button: "اطلب تدريبًا",
      subject: "طلب تدريب أمن سيبراني",
      body: "أهلًا أحمد،\n\nالجهة:\nالموضوع / الوحدات:\nعدد المتدربين ومستواهم:\nحضوري أم أونلاين:\nالمواعيد المناسبة:\n",
      more: { label: "الأشكال والتفاصيل", href: "/ar/training" },
    },
  },
};

/* The Arabic page's own words around the sections */
export const TEACHING_AR_PAGE = {
  title: "أحمد عماد نصر — مدرب أمن سيبراني وأمن معلومات",
  description:
    "أحمد عماد نصر، مدرب أمن سيبراني في AMIT والمعهد القومي للاتصالات (NTI): دبلومة SOC والأمن السيبراني (160 ساعة) وحدةً بوحدة، وأين درّستها، وما كتبه الطلاب.",
  feedback: {
    eyebrow: "آراء // من طلابي",
    titleA: "من",
    titleB: "طلابي.",
    description: "ما كتبه الطلاب بعد الكورس — بدون أسماء، ومنقول كما كتبوه حرفيًا.",
    chip: "رأي منقول",
    showMore: "عرض المزيد من الآراء",
  },
  /* The link on the English page that leads here, and back */
  switchToArabic: "اقرأ هذه الصفحة بالعربية",
  switchToEnglish: "Read this page in English",
};
