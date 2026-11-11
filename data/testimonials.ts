/*
 * What other people wrote about him — quoted word for word.
 *
 * ═══ data/testimonials.ts → components/home/Testimonials.tsx (#testimonials) ═══
 *   RECOMMENDATIONS → LinkedIn recommendations: named, with the writer's
 *                     headline as LinkedIn shows it, and a link to read them
 *                     there (the proof).
 *   STUDENT_FEEDBACK → written course feedback from students. Kept
 *                     anonymous (no names were given with it); `source` says
 *                     which course it came from when the student said so.
 *
 * RULES: copy the words exactly — no rewording, no "improving", typos
 * included. Every student response is here in full; a line break in the
 * original is "\n" (shown as a new paragraph). Arabic quotes set lang: "ar" (they are shown
 * right-to-left). Add one by copying an entry; the counts on the page and in
 * the Teaching section's numbers (data/teaching.ts) update by themselves.
 */

export const LINKEDIN_RECOMMENDATIONS_URL = "https://www.linkedin.com/in/ahmed-emad-nasr/details/recommendations/";

export type Testimonial = {
  quote: string;
  /** Who wrote it — a name for recommendations, a description for students */
  author: string;
  /** Their role / where the feedback came from */
  source: string;
  lang?: "en" | "ar";
  date?: string;
};

export const RECOMMENDATIONS: readonly Testimonial[] = [
  {
    author: "Abdelrahman Ahmed",
    source: "Head of Cyber Security · GDG Benha & 3C — managed Ahmed directly",
    date: "2026-03-26",
    quote:
      "As Head of Cyber Security, I worked with Ahmed Emad Eldeen as a Technical Cyber Security member. He is dedicated, ambitious, and always eager to learn.\nOne of the best I’ve worked with. Wishing him all the best!",
  },
  {
    author: "Ahmed Hamdto",
    source: "Freelancing Instructor @ MCIT (DEPI) — mentored Ahmed directly",
    date: "2026-03-26",
    quote:
      "I highly recommend Ahmed, one of the most dedicated and hardworking students I’ve mentored in freelancing. He demonstrated strong professionalism and commitment throughout the training.\nAhmed successfully set up and optimized his freelancing profiles with great attention to detail, showing a clear understanding of the market. Notably, his portfolio was recognized as a “Best Portfolio”, reflecting the high quality of his work and presentation.\nHe is a fast learner, disciplined, and able to apply his knowledge effectively. I’m confident he will be a valuable addition to any team or project.\nI strongly recommend him for any freelancing opportunity, job, or professional opportunity.",
  },
];

/* The order balances the three-column wall (two on tablets): the columns
   fill top to bottom, so a long quote next to short ones keeps them even.
   Re-check the wall's column heights after adding one. */
export const STUDENT_FEEDBACK: readonly Testimonial[] = [
  {
    author: "Student",
    source: "Cybersecurity (SOC) course · AMIT",
    quote:
      "I would like to thank Eng. Ahmed Emad Nasr for his great efforts throughout the Cybersecurity (SOC) course with Amit. The content was very well-organized, clear, informative, and engaging.\nThe explanations were easy to follow and included practical, real-world examples that helped me understand how to handle different scenarios in the cybersecurity field. The various exercises and TryHackMe rooms were also extremely valuable, allowing me to apply what I learned and gain practical experience.\nI truly appreciate the effort, dedication, and knowledge shared throughout the course, as well as the patience and engagement during the sessions. It was a very valuable learning experience.",
  },
  {
    author: "Student",
    source: "Cybersecurity (SOC) course · AMIT",
    quote:
      "I would like to express my sincere appreciation to Eng Ahmed Emad Nasr for his outstanding efforts and support throughout the Cybersecurity (SOC) course with Amit.\nThe course was a great learning experience, as the topics were presented in a structured and understandable way, making even complex cybersecurity concepts easier to grasp. I particularly appreciated the practical approach, as the hands-on activities, real-life scenarios, and TryHackMe labs provided an excellent opportunity to strengthen my technical skills and connect theoretical knowledge with practical applications.\nWhat made the experience even more valuable was the instructor’s ability to explain concepts clearly, encourage participation, and create an interactive learning environment. His commitment, professionalism, and willingness to share his experience truly made a difference.\nThank you for your dedication and for making this course both informative and enjoyable. I genuinely appreciate everything I have learned throughout this journey.",
  },
  {
    author: "Mentee",
    source: "Cybersecurity learning",
    quote:
      "Despite his young age, he is exceptionally talented and highly skilled in his field. He has been one of the people who contributed the most to my learning and professional growth, always helping me understand new concepts and stay up to date through his extensive knowledge and expertise.",
  },
  {
    author: "Student",
    source: "Cyber Security course",
    lang: "ar",
    quote:
      "بجد حابب أشكر البشمهندس احمد على الفترة الجميلة اللي اتعلمنا فيها معاه في كورس الـ Cyber Security\nاستفدت منه كتير واتعلمت معاه حاجات مهمة في مجالات مختلفة زي الـ Network والـ Attacks والـ Linux والـ Windows والـ Security+\nكان دايمًا حريص إنه يوصل المعلومة لينا ويساعدنا نفهم ونربط المواضيع ببعضها وده فرق معايا جدًا خلال فترة الكورس\nبشكره على مجهوده وتعبه معانا وعلى كل المعلومات اللي شاركها معانا وإن شاء الله نقدر نستفيد بيها في حياتنا العملية ونكمل طريقنا في مجال الـ Cyber Security\nكل الشكر والتقدير ليه ❤️",
  },
  {
    author: "Student",
    source: "Cybersecurity course",
    lang: "ar",
    quote: "مشاء الله ممتاز في توصيل معلومات و اسلوب ممتاز جدا",
  },
  {
    author: "Student",
    source: "Cybersecurity course",
    lang: "ar",
    quote:
      "بشمهندس احمد بجد انا عايز اشكرك جدا علي مجهودك و علي كل حاجه عملتها معانا في الكورس بجد .. اد ايه انت شخص جميل و بتحب تساعد الناس و بتحب تعلمهم و اهم حاجه كانت فيك انك مش بخيل في معلوماتك معانا حتي لو اسألتنا برا نطاق الكورس كنت بتساعدنا .. بجد بجد انا مبسوط انك كنت الانستوكتور بتاعي في الكورس و بجد ربنا هيكرمك اوي علشان الي عملته معنا كلنا\nبجد شكرا ليك من كل قلبي ❤️❤️",
  },
  {
    author: "Student",
    source: "Cybersecurity course",
    lang: "ar",
    quote: "تسلم يابشمهندس علي شرحك الي فيحته تانيه وشغلك معانا بجد الواحد مستواه في السكيورتي فرق جدا",
  },
  {
    author: "Student",
    source: "Cybersecurity course",
    quote:
      "One of the best instructors ever as he breaks down complex topics into simple, manageable steps instead of overloading learners & use real-world examples to make lessons interesting , also Ahmed is So diligent & full of potential and the way he teaches is unique and always creative I wish him every success in his future career.",
  },
  {
    author: "Student",
    source: "Kali Linux & penetration testing",
    lang: "ar",
    quote:
      "حبيت أتوجه بشكر خاص ومميز للمهندس احمد عماد نصر على الفترة اللي قضيتها معاه في دراسة Kali Linux بشكل احترافي. بفضل الله ثم بفضل خبرته العميقة وأسلوبه المميز في الشرح العملي، قدرت أتخطى الكثير من التعقيدات وأفهم الآليات الحقيقية للأدوات والـ Penetration Testing. شكراً لصدقك في إيصال المعلومة وحرصك الدائم على إننا نطلع بأكبر قدر ممكن من الاستفادة. ممتن جداً لوقتك وجهدك.",
  },
  {
    author: "Student",
    source: "Cybersecurity course",
    lang: "ar",
    quote:
      "بشمهندس احمد ممتاز جدا بيبسط المعلومه بطريقه لذيذه وتطبيق عملي معانا خطوه بخطوه غير طبعا حكاياته وخبراته والعقبات اللي قابلته بينصحنا ازاي نتجنبها غير اسأله انترفيوز والسيناريوهات اللي بيعودنا عليها\nفتقيمي 10/10 + نجمه",
  },
  {
    author: "Student",
    source: "Cybersecurity course",
    lang: "ar",
    quote: "وبفهم من حضرتك جدا وبستفاد من حضرتك جدا والسيشن نظامها كويس جدا احسن instractor",
  },
  {
    author: "Student",
    source: "Cybersecurity course",
    quote:
      "Its going well, its somewhat difficult to understand a few things, and some stuff makes the future feel bleak but its okay.",
  },
  {
    author: "Student",
    source: "Cybersecurity course",
    quote: "10/10",
  },
];

/** Everything quoted — the count shown in the Teaching numbers */
export const TESTIMONIALS: readonly Testimonial[] = [...RECOMMENDATIONS, ...STUDENT_FEEDBACK];
