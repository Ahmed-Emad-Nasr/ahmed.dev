# تبسيط البورتفوليو — إيه اللي اتغيّر وفين

الفكرة في كل صفحة: **الكلام البسيط الأول، وبعده التفاصيل التقنية**. مفيش أي تفاصيل تقنية أو evidence اتشالت — اتنقلت بس تحت شرح بسيط.

## 1. اللوجوهات (جديد)

| الملف | الدور |
|---|---|
| `data/logos.ts` | كل اسم شركة/منصة/أداة → لوجو (Banque Misr، NTI، Huawei، TryHackMe، Burp Suite …) |
| `components/ui/Logo.tsx` | بيرسم اللوجو: ملف رسمي ← وإلا brand mark ← وإلا monogram بستايل الموقع |
| `scripts/generate-logos.mjs` | بيولّد `components/ui/logo-data.ts` من `simple-icons` + الملفات اللي في `public/Assets/logos/` |
| `package.json` | `predev` و `prebuild` بيشغّلوا السكريبت لوحدهم + `npm run logos` + `simple-icons` كـ devDependency |

اللوجوهات ظهرت في: الخبرات، التدريس، منصات التدريب، المشاريع (جوه chips الـ stack)، كروت الشهادات في الـ Gallery، صفحة الـ CV (كل خبرة وكل شهادة)، الـ Home Lab (جوه الرسمة + قائمة "كل جزء بيعمل إيه")، كروت الـ cases (لوجو المنصة) وصفحة الـ case (المنصة + الأدوات)، والـ Detection Library.

**مهم:** الشركات المصرية (Banque Misr، NTI، AMIT، DEPI، ITI، iSchool، جامعة بنها …) مالهاش لوجو في أي مكتبة، فبتظهر monogram لحد ما تحط اللوجو الرسمي. حط الملف في `public/Assets/logos/` باسم الـ slug (الجدول في `README.md` → Logos) وهيظهر لوحده في كل مكان.

## 2. الـ Navigation والـ Command palette والـ Shortcuts

- `SiteNav.tsx`: "Work" بقت "Projects"، وكل لينك ليه وصف قصير (tooltip على الديسكتوب وسطر تحت الاسم في منيو الموبايل بدل الكتابة اليابانية). زرار ⌘K بقى "Search · Ctrl K".
- `CommandPalette.tsx`: مجموعات واضحة (Pages / Home page / Blog / Gallery / Actions / Links / Settings / Extras)، أسماء بسيطة، سطر شرح لما يكون فاضي، رسالة "مفيش نتايج" بتقترح كلمات.
- `ShortcutsHelp.tsx`: "اختياري — الموقع شغال بالماوس"، "G then H" بدل "g h"، و"+" للمفاتيح اللي بتتداس مع بعض.
- `PaletteHint.tsx` و `MobileActionBar.tsx`: نص أبسط، و"Download CV".

## 3. صفحة الـ Blog

- `app/blog/page.tsx`: مقدمة بسيطة + لينكات بأسماء مفهومة ("New here? Read this"، "Attack map"، "Try a quiz"، "How I test security").
- `components/blog/BlogGuide.tsx` (جديد): "How to read this blog" — الـ 4 أنواع cases، الـ 5 أسئلة اللي كل case بيجاوبها، و8 كلمات بتتكرر (مقفولة لحد ما تفتحها).
- `CaseLibrarySection.tsx` / `CaseFilters.tsx` / `lib/shared.ts`: "Case Studies"، فلاتر بأسماء بسيطة (Investigations / Projects / Practice labs / Study notes)، "Best first / Newest first"، رسالة "مفيش نتايج" بتقول تعمل إيه.
- `StartHere.tsx` و `data/start-here.ts`: أهم 3 cases مشروحين لأي حد.

## 4. صفحة الـ Case (أكبر تغيير)

- `components/blog/CaseArticle.tsx` اتبنت من جديد:
  1. **In plain words** — نوع الشغل، الموضوع يعني إيه، والنتيجة (real attack ولا false alarm + الخطورة بالكلام)، و"New to security?" بشرح كل المصطلحات اللي في الصفحة دي بالذات.
  2. **On this page** — لينكات للفصول.
  3. **01 The goal** — الهدف + Key facts.
  4. **02 What happened?** — الـ verdict + "How the attack unfolded" + Timeline.
  5. **03 What I did** — الخطوات بالترتيب + النتيجة + الأدوات (بلوجوهات) + المهارات.
  6. **04 How to prevent it** — اللي اتعمل في الريبورت + الـ detection rules + الدروس المستفادة + نصايح عامة لنفس نوع المشكلة (مكتوب عليها إنها عامة).
  7. **05 Evidence & supporting files** — screenshots، IOCs، MITRE ATT&CK، الملفات، الـ PDF، والفيديو.
- `lib/case-guide.ts` (جديد): الطبقة البسيطة (شرح الأنواع والمواضيع، الـ verdict والـ severity بالكلام، نصايح الوقاية، القاموس). بتتحسب على السيرفر، فمفيش JS زيادة للزائر.
- `CaseSummary.tsx`: اتقسم لـ 3 أجزاء (الهدف / الخطوات / الـ indicators).
- `CaseFile.tsx`: اتقسم لقطع (CaseFacts، CaseChain، CaseIocs، CaseResponse …) بعناوين وشرح بسيط.
- الأزرار: **Read the case**، **View technical PDF**، **Download PDF**، **See the evidence**.

## 5. باقي الصفحات

- **Detection Library**: "يعني إيه detection rule" + 3 خطوات بسيطة، وصف لكل عائلة rules، "Urgency" بدل "Level" مع شرح الألوان.
- **Home Lab**: بقى **How I Test Security** — 4 خطوات (Attack → Record → Detect → Respond)، الرسمة باللوجوهات، و"What each part does".
- **ATT&CK** و **Triage quiz**: مقدمات بسيطة.
- **Gallery**: مقدمة بسيطة، فلاتر بأسماء مفهومة + سطر شرح لكل فلتر، "View certificate"، لوجو الجهة على كل شهادة.
- **CV**: "Download CV"، "Back to the home page"، فقرة بتشرح الصفحة، لوجوهات، وإصلاح React key متكرر.
- **Contact**: "Let's Talk" + رسالة مباشرة، زرار WhatsApp واضح، labels ظاهرة للحقول، 3 خطوات "إيه اللي هيحصل"، "Send message / Sending… / Message sent ✓"، ورسالة واضحة لو الإرسال فشل.
- **404 / Error**: كلام بسيط ("مش غلطتك")، أزرار Go to the home page / Browse case studies / Download CV / Contact me / Reload.
- **Hero و Stats**: Download CV، See my projects، "At a glance"، "Investigation reports"، "YouTube views".
- **Experience / Teaching / Platforms / Projects**: مقدمات بسيطة + لوجوهات + نوع الخبرة (Job / Volunteer / Education).

## 6. التنضيف (الجولة التانية)

- **الكتابة اليابانية:** اتشالت من كل مكان جنب العناوين والأزرار والأرقام والكروت، ومن الخطوط الفاصلة، والفوتر ("次のレベル")، وتحت الاسم في الـ hero، وشارة العنوان، وتاج "JP" في الخبرات، وفلاتر المشاريع، والمنصات، والتدريس، وصفحات الـ case والأخطاء. واتشالت كمان الحقول اليابانية من الداتا والـ types.
  - **اللي فضل (عشان بيحسّن الشكل):** العلامات المائية الباهتة في الخلفية (`KanjiWatermark` والحروف الرأسية)، وحروف منيو الموبايل الباهتة، و"終わり" في الفوتر، وخلفية الـ hero، وختم "村長" على الصورة، والشريط المتحرك (`TickerStrip`)، وكلمات شاشة التحميل، وتأثير الماوس.
- **صفحة الـ CV بصيغة HTML اتشالت** (`app/cv`): الـ CV بقى PDF بس. كل اللينكات (الفوتر، البحث، الـ sitemap، السكريبتات) بقت بتفتح الـ PDF على طول، و`data/cv.ts` فاضل فيه `CV_SUMMARY` بس.
- **الـ Gallery:** كروت "Start here" اتشالت، وقسم الصور بقى صور الفصول والفعاليات بس ("Teaching & Events")، من غير صور الشهادات المتكررة (الشهادات كلها موجودة في القائمة اللي فوق).
- **قسم "Risk to Response"** اتشال من صفحة الـ Blog، وكمان الكومبوننت والداتا بتاعته واختصاره في البحث.
