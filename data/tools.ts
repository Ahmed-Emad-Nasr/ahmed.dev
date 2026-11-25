/*
 * ═══ data/tools.ts — the tool pages ( URL: /projects/<id> ) ═══
 *
 * One entry = one page for a tool I wrote: what it does, how to install and
 * run it, a sample of what it prints, and screenshots. The card on the home
 * page (data/portfolio-data.ts, same `id`) links to it.
 *
 * TO ADD SCREENSHOTS to a tool page:
 *   1. convert them to .webp and put them in public/Assets/projects/<id>/
 *   2. list them in that tool's `screenshots`:
 *        screenshots: [{ src: "Assets/projects/webp-converter/gui.webp", alt: "The converter window" }],
 *
 * TO ADD A TOOL PAGE: copy an entry; `id` must match its project in
 * data/portfolio-data.ts (that is where its title, tagline, stack and GitHub
 * link come from).
 */

type ToolPage = {
  /** The project id in data/portfolio-data.ts — also the URL: /projects/<id> */
  id: string;
  /** The second (red) line of the page title */
  headline: string;
  japanese: string;
  /** What it is, for someone who has never seen it — two or three sentences */
  about: string;
  /** What it does, one short line each */
  features: string[];
  /** What you need before installing */
  requirements: string[];
  /** Install and first run, one shell command per line ("# …" lines are comments) */
  install: string[];
  /** More ways to run it: a label and the command */
  examples?: { label: string; command: string }[];
  /** A short sample of what it prints */
  sampleOutput?: string;
  screenshots?: { src: string; alt: string }[];
  /** Operating systems it runs on (for search engines) */
  os: string;
  license?: string;
};

export const TOOL_PAGES: ToolPage[] = [
  {
    id: "cybersuite",
    headline: "PDF Malware Triage.",
    japanese: "解析",
    about:
      "A suspicious PDF usually means one parser in one window and four threat-intel sites in four tabs. 3OMDA CyberSuite puts that work in one place: it takes a PDF apart statically — without opening it — scores how dangerous it looks, pulls out every indicator, and writes the report. It grew out of two of my earlier tools, a PDF malware-analysis toolkit and a threat-intelligence lookup tool.",
    features: [
      "Reads the PDF's metadata, objects and streams, and decompresses the streams",
      "Finds JavaScript (/JS, /OpenAction, /AA) and dangerous calls like eval and unescape",
      "Extracts URLs, e-mail addresses, IPs and Base64 / hex payloads as indicators",
      "Detects and extracts embedded files",
      "Scores the risk: LOW, MEDIUM, HIGH or CRITICAL, with the reason for every point",
      "Writes a full text report for each file, one PDF or a whole folder at a time",
      "Threat-intel lookups: VirusTotal, Hybrid Analysis, NVD, AbuseIPDB and AlienVault OTX",
    ],
    requirements: ["Python 3", "PyPDF2 (installed from requirements.txt)"],
    install: [
      "git clone https://github.com/Ahmed-Emad-Nasr/3omda-PDFparser-tool.git",
      "cd 3omda-PDFparser-tool",
      "pip install -r requirements.txt",
      "python main.py",
      "# then paste the path of a PDF, or of a folder of PDFs",
    ],
    examples: [
      { label: "Make a harmless test PDF", command: "python make-pdf-helloworld.py" },
      { label: "Make a test PDF with JavaScript in it", command: "python make-pdf-javascript.py" },
    ],
    sampleOutput: `===== Analyzing: malware.pdf =====

=== KEYWORDS ===
/JS : 1
/JavaScript : 1
/OpenAction : 1
/EmbeddedFile : 2

=== JAVASCRIPT ANALYSIS ===
DANGEROUS FUNCTIONS DETECTED:
  - eval execution
  - unescape function
  - String.fromCharCode

=== RISK ASSESSMENT ===
CRITICAL | Score: 145
- /JS detected
- eval() usage
- URLs in text: 2

Report saved: reports/report_malware.txt`,
    os: "Windows, Linux, macOS",
    license: "MIT",
  },
  {
    id: "webp-converter",
    headline: "Images, Lighter.",
    japanese: "変換",
    about:
      "Screenshots for reports — and for this site — were heavy PNGs, and converting them one by one does not scale. This tool turns a single image or a whole folder of JPG, PNG, BMP, GIF and TIFF files into WebP, compressed hard with almost no visible loss, and tells you how much space it saved. Every case screenshot on this site went through it.",
    features: [
      "Converts JPG, PNG, BMP, TIFF and static GIF to WebP",
      "One image, a whole folder, or a folder and all its subfolders",
      "Quality from 0 to 100 (82 by default), with the strongest compression method",
      "Keeps transparency — or drops it for even smaller files",
      "Keeps the original when the WebP would come out larger",
      "Keeps the folder structure in a separate output folder",
      "Prints a summary at the end: files converted, size before and after, space saved",
    ],
    requirements: ["Python 3.10 or newer", "Pillow 10 or newer (installed from requirements.txt)"],
    install: [
      "git clone https://github.com/Ahmed-Emad-Nasr/3omda-WEBP-Converter-and-compressor.git",
      "cd 3omda-WEBP-Converter-and-compressor",
      "pip install -r requirements.txt",
      "python convert.py ./images/",
    ],
    examples: [
      { label: "One image", command: "python convert.py photo.jpg" },
      { label: "Custom quality, separate output folder", command: "python convert.py ./images/ --quality 80 --output ./images_webp/" },
      { label: "Subfolders too, and delete the originals", command: "python convert.py ./images/ --quality 75 --recursive --delete-originals" },
      { label: "Drop transparency for smaller files", command: "python convert.py ./images/ --no-transparency" },
    ],
    sampleOutput: `  Conversion Summary
   Converted   : 24
   Failed      : 0
   Skipped     : 0
   WebP larger : 1  (original kept)

   Original size   : 18.4 MB
   Output size     : 11.2 MB
   Saved           : 7.2 MB  (39.1%)
   Time            : 3.4s`,
    os: "Windows, Linux, macOS",
  },
];

export const toolPageById = (id: string) => TOOL_PAGES.find((t) => t.id === id);
