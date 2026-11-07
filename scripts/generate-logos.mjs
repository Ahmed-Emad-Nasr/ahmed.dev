/*
 * generate-logos.mjs — writes components/ui/logo-data.ts:
 *
 *   - the brand marks named in data/logos.ts (`icon: "siHuawei"` …), copied
 *     from the simple-icons package (CC0, dev only: nothing ships but the
 *     path data the site uses);
 *   - the logo files present in public/Assets/logos/ (svg, webp, png, jpg),
 *     so a dropped-in official logo replaces the mark or the monogram.
 *
 *   npm run logos            (also runs before `npm run dev` and `npm run build`)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const specFile = path.join(root, "data", "logos.ts");
const logoDir = path.join(root, "public", "Assets", "logos");
const target = path.join(root, "components", "ui", "logo-data.ts");

/* simple-icons is a devDependency. If it is not installed yet (package.json
   changed but `npm install` was not run), keep the committed logo-data.ts
   and carry on instead of stopping `npm run dev` / `npm run build`. */
let simpleIcons;
try {
  simpleIcons = await import("simple-icons");
} catch {
  if (fs.existsSync(target)) {
    console.warn("logos: simple-icons is not installed — run `npm install`. Keeping the existing components/ui/logo-data.ts.");
    process.exit(0);
  }
  throw new Error("logos: simple-icons is not installed — run `npm install` first.");
}

/* Every simple-icons export data/logos.ts asks for */
const wanted = [...new Set([...fs.readFileSync(specFile, "utf8").matchAll(/icon:\s*"(si[A-Za-z0-9]+)"/g)].map((m) => m[1]))];

/* Brand colours too dark (or too light) to read on one of the two themes
   are drawn in the text colour instead. */
const luminance = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const marks = [];
for (const name of wanted) {
  const icon = simpleIcons[name];
  if (!icon) throw new Error(`simple-icons has no "${name}" — fix the icon name in data/logos.ts`);
  const l = luminance(icon.hex);
  const color = l < 0.035 || l > 0.85 ? null : `#${icon.hex}`;
  marks.push(`  ${name}: [${JSON.stringify(icon.title)}, ${JSON.stringify(color)}, ${JSON.stringify(icon.path)}],`);
}

/* Official logo files dropped into public/Assets/logos/ */
const files = [];
if (fs.existsSync(logoDir)) {
  const prefer = ["svg", "webp", "png", "jpg", "jpeg"];
  const bySlug = new Map();
  for (const f of fs.readdirSync(logoDir)) {
    const m = /^([a-z0-9-]+)\.(svg|webp|png|jpe?g)$/i.exec(f);
    if (!m) continue;
    const slug = m[1].toLowerCase();
    const ext = m[2].toLowerCase();
    const current = bySlug.get(slug);
    if (!current || prefer.indexOf(ext) < prefer.indexOf(current.ext)) bySlug.set(slug, { ext, file: f });
  }
  for (const [slug, { file }] of [...bySlug].sort()) files.push(`  ${JSON.stringify(slug)}: ${JSON.stringify(`Assets/logos/${file}`)},`);
}

const out = `/*
 * components/ui/logo-data.ts — generated, don't edit by hand
 * Run: npm run logos (data/logos.ts says which marks; public/Assets/logos/ holds the files)
 * Brand marks: simple-icons (CC0) — https://simpleicons.org
 */

/** [title, brand colour or null for "use the text colour", 24×24 path] */
type LogoMark = readonly [title: string, color: string | null, path: string];

export const LOGO_MARKS: Record<string, LogoMark> = {
${marks.join("\n")}
};

/** Logo files present in public/Assets/logos/, by slug */
export const LOGO_FILES: Record<string, string> = {
${files.join("\n")}
};
`;

fs.writeFileSync(target, out.replace(/\n/g, "\r\n")); // the repo uses CRLF
console.log(`logos: ${marks.length} brand marks, ${files.length} logo files → ${path.relative(root, target)}`);
