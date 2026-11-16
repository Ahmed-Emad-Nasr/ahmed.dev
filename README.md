<div align="center">

<a href="https://ahmed-emad-nasr.github.io/ahmed.dev/">
  <img src="./screenshots/home.png" alt="Ahmed Emad Nasr — portfolio home page" width="100%">
</a>

# AHMED EMAD NASR

### Information Security Portfolio · Blog · Teaching · Proof

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=19&duration=2800&pause=900&color=F0304F&center=true&vCenter=true&width=720&lines=Information+Security+Officer;GRC+%C2%B7+SOC+%C2%B7+IR%2FDFIR+%C2%B7+Malware+Analysis+%C2%B7+IAM;Cybersecurity+Instructor+%E2%80%94+AMIT+%26+NTI;83+case+studies+%C2%B7+56+ATT%26CK+techniques+mapped;%22Security+is+a+process.+Evidence+makes+it+repeatable.%22)](https://ahmed-emad-nasr.github.io/ahmed.dev/)

[![Live portfolio](https://img.shields.io/badge/LIVE-portfolio-BC002D?style=for-the-badge&logo=githubpages&logoColor=white)](https://ahmed-emad-nasr.github.io/ahmed.dev/)
[![Blog](https://img.shields.io/badge/BLOG-83_cases-111111?style=for-the-badge&logo=readdotcv&logoColor=white)](https://ahmed-emad-nasr.github.io/ahmed.dev/blog)
[![Teaching](https://img.shields.io/badge/TEACHING-160h_diploma-00A6B2?style=for-the-badge&logo=googleclassroom&logoColor=white)](https://ahmed-emad-nasr.github.io/ahmed.dev/teaching)
[![Gallery](https://img.shields.io/badge/PROOF-certificates-E3B341?style=for-the-badge&logo=credly&logoColor=black)](https://ahmed-emad-nasr.github.io/ahmed.dev/gallery)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-connect-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ahmed-emad-nasr/)
[![YouTube](https://img.shields.io/badge/YouTube-@AhmedEmad--0x3omda-FF0000?style=flat-square&logo=youtube&logoColor=white)](https://www.youtube.com/@AhmedEmad-0x3omda)
[![TryHackMe](https://img.shields.io/badge/TryHackMe-profile-212C42?style=flat-square&logo=tryhackme&logoColor=white)](https://tryhackme.com/p/Ahmed.Emad.Nasr)
[![Email](https://img.shields.io/badge/Email-ahmed.em.nasr%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:ahmed.em.nasr@gmail.com)

[![PageSpeed mobile](https://img.shields.io/badge/PageSpeed_mobile-94-0CCE6B?style=flat-square&logo=pagespeedinsights&logoColor=white)](#-pagespeed---report)
[![PageSpeed desktop](https://img.shields.io/badge/PageSpeed_desktop-97-0CCE6B?style=flat-square&logo=pagespeedinsights&logoColor=white)](#-pagespeed---report)
[![Accessibility](https://img.shields.io/badge/Accessibility-100-0CCE6B?style=flat-square&logo=accessibleicon&logoColor=white)](#-pagespeed---report)
[![SEO](https://img.shields.io/badge/SEO-100-0CCE6B?style=flat-square&logo=google&logoColor=white)](#-pagespeed---report)
[![License: GPL-3.0](https://img.shields.io/badge/code-GPL--3.0-555555?style=flat-square)](./LICENSE)

</div>

---

## `> whoami`

```yaml
project    : ahmed.dev — the portfolio of Ahmed Emad Nasr (0x3omda)
role       : Information Security Officer · Cybersecurity Instructor (AMIT & NTI)
covers     : GRC · SOC · Incident Response & DFIR · Malware Analysis · IAM · Data Security
live       : https://ahmed-emad-nasr.github.io/ahmed.dev/
pages      : /  ·  /blog  ·  /blog/<case>  ·  /teaching  ·  /ar/teaching  ·  /gallery
built_with : Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS v4 · GSAP · Framer Motion
hosting    : GitHub Pages — no server, everything is built ahead of time
```

Not a static résumé: a **case library**. Every project connects the finding,
the evidence, the analysis, the response and the lesson — written so a
recruiter can follow it in plain words, with the reports, detection rules and
MITRE ATT&CK mapping underneath for the technical reader.

---

## `> pagespeed --report`

Measured with [PageSpeed Insights](https://pagespeed.web.dev/) on the live home page.
Lab scores vary by a few points between runs.

<table>
  <tr>
    <th align="center">📱 Mobile — 94</th>
    <th align="center">🖥️ Desktop — 97</th>
  </tr>
  <tr>
    <td><img src="./screenshots/pagespeed-mobile.webp" alt="PageSpeed Insights, mobile: Performance 94, Accessibility 100, Best Practices 100, SEO 100" width="100%"></td>
    <td><img src="./screenshots/pagespeed-desktop.webp" alt="PageSpeed Insights, desktop: Performance 97, Accessibility 100, Best Practices 100, SEO 100" width="100%"></td>
  </tr>
</table>

| Metric | Mobile | Desktop | What it means |
| :-- | :--: | :--: | :-- |
| Largest Contentful Paint | **1.8 s** | **0.4 s** | the main content is on screen |
| Total Blocking Time | **40 ms** | **50 ms** | the page never freezes while it loads |
| Cumulative Layout Shift | **0.005** | **0.003** | nothing jumps around |
| First Contentful Paint | 1.8 s | **0.4 s** | first pixels |
| Speed Index | 5.2 s | 1.7 s | held back on purpose by the intro screen and the entrance animations |

---

## `> ls /pages`

```mermaid
flowchart LR
  H["/  —  Portfolio<br/>roles · projects · experience<br/>recommendations · FAQ · contact"]
  B["/blog  —  Blog<br/>83 cases · 35 videos<br/>ATT&CK · detection rules · triage · home lab"]
  C["/blog/&lt;case&gt;<br/>one report per case"]
  T["/teaching  —  Teaching<br/>160 h diploma · where it was taught<br/>student feedback"]
  G["/gallery  —  Proof<br/>49 certificates & records · 50 photos"]
  H --> B --> C
  H --> T
  H --> G
```

| Page | What is on it |
| :-- | :-- |
| [`/`](https://ahmed-emad-nasr.github.io/ahmed.dev/) | Hero, roles, services, projects, open source, tools, experience, the path, LinkedIn recommendations, training platforms, process, FAQ, contact |
| [`/blog`](https://ahmed-emad-nasr.github.io/ahmed.dev/blog) | Searchable library of **83** cases, **35** videos, **56** ATT&CK techniques mapped, **50+** custom Wazuh rules, a triage challenge, the home lab |
| `/blog/<case>` | Goal → what happened → what I did → how to prevent it → evidence, with the PDF report |
| [`/teaching`](https://ahmed-emad-nasr.github.io/ahmed.dev/teaching) | The 160-hour SOC & Cybersecurity Diploma module by module, where it was taught, **25** student notes quoted word for word, and a training request for teams |
| [`/cv`](https://ahmed-emad-nasr.github.io/ahmed.dev/cv) | The CV as a web page (from `data/cv.ts`), with the PDF download — indexable as "Ahmed Emad Nasr CV" |
| [`/videos`](https://ahmed-emad-nasr.github.io/ahmed.dev/videos) | Every YouTube video and playlist; each video also has its own page `/videos/<slug>` with `VideoObject` data |
| [`/attack`](https://ahmed-emad-nasr.github.io/ahmed.dev/attack) | Every MITRE ATT&CK technique the cases show, by tactic; each has its own page `/attack/<T-id>` with its cases, sub-techniques and tools |
| `/writeups/<platform>` | The write-ups of one platform — [TryHackMe](https://ahmed-emad-nasr.github.io/ahmed.dev/writeups/tryhackme), [PortSwigger](https://ahmed-emad-nasr.github.io/ahmed.dev/writeups/portswigger), [LetsDefend](https://ahmed-emad-nasr.github.io/ahmed.dev/writeups/letsdefend) |
| `/projects/<tool>` | A page per tool I wrote — [CyberSuite](https://ahmed-emad-nasr.github.io/ahmed.dev/projects/cybersuite), [WebP Converter](https://ahmed-emad-nasr.github.io/ahmed.dev/projects/webp-converter): what it does, how to run it, sample output |
| [`/training`](https://ahmed-emad-nasr.github.io/ahmed.dev/training) · [`/ar/training`](https://ahmed-emad-nasr.github.io/ahmed.dev/ar/training) | Training for teams, in English and Arabic (`hreflang`): who it is for, the formats, the diploma module by module, student quotes and a request button |
| [`/ar/teaching`](https://ahmed-emad-nasr.github.io/ahmed.dev/ar/teaching) | The same page in Arabic (right to left, Cairo font), linked to the English one with `hreflang` |
| [`/gallery`](https://ahmed-emad-nasr.github.io/ahmed.dev/gallery) | Degree, certifications, courses and records, photos from classrooms and events |

Operator tools on every page: `Ctrl / ⌘ + K` command palette · `?` keyboard
shortcuts · `g` + key to jump to a section · type `3omda` for the terminal.

---

## `> cat /ops/capabilities.txt`

| Domain | Focus |
| :-- | :-- |
| `GOVERN` | GRC, ISO 27001, PCI DSS, NIST CSF, risk and compliance |
| `DETECT` | Wazuh, Splunk, MITRE ATT&CK, custom rules, alert triage |
| `RESPOND` | NIST 800-61, Volatility, YARA, incident reporting |
| `INVESTIGATE` | DFIR, malware analysis, email analysis, timeline reconstruction |
| `PROTECT` | IAM, PAM, DLP, cloud security, data security |
| `TEACH` | SOC & Cybersecurity Diploma — CCNA, Linux, Security+, SEC450, labs |

---

## `> cat /stack.conf`

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-0B1120?style=flat-square&logo=tailwindcss&logoColor=38BDF8)
![GSAP](https://img.shields.io/badge/GSAP-0AE448?style=flat-square&logo=greensock&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

- **Static export.** `npm run build` writes plain HTML/CSS/JS to `out/`; GitHub Pages serves it.
- **Every section in the HTML.** Each section is its own `next/dynamic` chunk, but all of it is rendered ahead of time — every `#anchor` works and crawlers see the whole page. Long lists open with **Show more**.
- **Searchable by people and by Google.** Name-first titles and descriptions per page, one `<h1>` per page, JSON-LD (Person, WebSite, Blog, Course, ImageGallery, TechArticle, BreadcrumbList), sitemap with images and videos, RSS feed for the cases.
- **Accessible.** WCAG 2.2 AA checked with axe-core on every page kind, on phone and desktop, dark and light theme. Text scales with the browser's font size; reduced motion is respected.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for routes, loading rules, code
splitting and asset ownership.

---

## `> make verify`

Every push to `master` runs the same gates in GitHub Actions before it deploys:

```mermaid
flowchart LR
  A[lint] --> B[type-check] --> C[check:data] --> D[check:assets] --> E[build] --> F[check:links] --> G((deploy))
```

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript, strict
npm run check:data    # every case, ATT&CK id, video id and date is consistent
npm run check:assets  # every image / PDF the data points at exists
npm run build         # static export to out/
npm run check:links   # every internal link in out/ resolves
npm run check:a11y    # axe-core, WCAG 2.2 AA (needs Playwright)
```

Or all of them at once: `npm run verify`.

Every Monday, `.github/workflows/links.yml` also builds the site and checks
every **outside** link (repos, videos, certificate pages, platforms); dead ones
are listed in one GitHub issue, *Broken external links*.

---

## `> ./quickstart.sh`

```bash
git clone https://github.com/Ahmed-Emad-Nasr/ahmed.dev.git
cd ahmed.dev
npm install
npm run dev          # http://localhost:3000
```

No environment setup: the deploy workflow reads the address from the
repository (`/ahmed.dev` here; the domain root if it is ever deployed from
`Ahmed-Emad-Nasr.github.io`) — see `.env.example` to test a sub-path locally. The contact form needs no setup: it
opens the visitor's mail app with the message filled in, with Gmail and
"copy message" as fallbacks.

**Adding a case, video, certificate or job:** [`HOW-TO-ADD.md`](HOW-TO-ADD.md)
(step by step) · [`AI-PROMPT.md`](AI-PROMPT.md) (a prompt for any AI
assistant — AI tools that open the repo read the same rules from `AGENTS.md`).

---

## `> tree -L 2`

```text
app/          routes: /, /blog, /blog/[slug], /teaching, /ar/teaching, /gallery, metadata, sitemap, feeds
components/
  layout/     navigation, theme, terminal, command palette, shortcuts, footer
  ui/         shared pieces: SectionHeader, CounterChip, ShowMore, kit
  home/       portfolio and teaching sections
  blog/       case library, filters, case pages, ATT&CK, detection rules
  gallery/    proof gallery and lightbox
data/         all site content, as typed TypeScript
lib/          routes (which section lives on which page), SEO, scrolling, performance
scripts/      asset generation and build checks
public/       images, reports, icons, service worker
screenshots/  README images
```

**Adding a case:** add it to [`data/cases.ts`](./data/cases.ts) → add its
screenshots → optional details and ATT&CK mapping → `npm run thumbs` and
`npm run og:cases` → `npm run check:data` and `npm run check:assets`.

**Moving a section to another page:** one line in `SECTION_PAGE`
([`lib/routes.ts`](./lib/routes.ts)) — the navbar, palette, shortcuts and old
links follow it.

---

## `> visual --telemetry`

<p align="center">
  <img src="./screenshots/art_gallery.png" alt="Gallery loading screen" width="100%">
</p>

<p align="center">
  <img src="./gif/anime-frieren.gif" alt="Animated visual" width="240">
  &nbsp;&nbsp;&nbsp;
  <img src="./gif/giphy.gif" alt="Animated visual" width="240">
</p>

---

## `> cat CREDITS LICENSE`

The Neo-Samurai design language and component structure are based on
[Sensei-Dev](https://github.com/MostafaSensei106/Sensei-Dev) by Mostafa
Mahmoud, licensed under GPL-3.0. The portfolio content is original and is not
covered by the GPL.

Two licenses — details in [CONTENT-LICENSE.md](./CONTENT-LICENSE.md):

- **Code** (`app/`, `components/`, `lib/`, `scripts/`, configs): [GPL-3.0](./LICENSE).
- **Content** (CV, reports, screenshots, photos, certificates and the written
  text in `data/`): © Ahmed Emad Nasr, all rights reserved.

Testimonials belong to their authors; fonts are under the SIL Open Font License 1.1.

<div align="center">

<br>

`SECURITY IS A PROCESS. EVIDENCE MAKES IT REPEATABLE.`

<sub>侍 · 0x3omda</sub>

</div>
