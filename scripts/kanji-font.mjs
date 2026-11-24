/*
 * kanji-font.mjs — re-cut the site's kanji font to the characters it shows.
 *
 *   npm run build && npm run fonts:kanji      (GitHub Actions: every deploy)
 *
 * The decorative kanji use the site's own cut of Yuji Syuku: small files
 * holding only the characters the built pages draw (scripts/subset-yuji-site.py
 * → app/fonts/yuji-site-*.woff2 + app/fonts-yuji-site.css). A new kanji in a
 * section would otherwise come from Google's bigger slices; this fetches the
 * font (the @expo-google-fonts package — the same Google Fonts file), runs
 * the cut, and says whether anything changed. The deploy workflow rebuilds
 * once and commits the new files when it did.
 *
 * Needs the build output (out/) and Python with fonttools + brotli
 * (requirements.txt). Prints "kanji-font: changed" or "kanji-font: unchanged".
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONT_PACKAGE = "@expo-google-fonts/yuji-syuku@0.4.2";
const FONT_FILE = "package/400Regular/YujiSyuku_400Regular.ttf";

if (!existsSync(join(ROOT, "out"))) {
  console.error("kanji-font: build first (npm run build) — the cut is worked out from out/");
  process.exit(1);
}

/* A fingerprint of the current cut, to tell whether it changed */
const fingerprint = () => {
  const h = createHash("sha256");
  const dir = join(ROOT, "app", "fonts");
  for (const f of readdirSync(dir).filter((f) => f.startsWith("yuji-site-")).sort()) h.update(f).update(readFileSync(join(dir, f)));
  h.update(readFileSync(join(ROOT, "app", "fonts-yuji-site.css")));
  return h.digest("hex");
};

const before = fingerprint();
const tmp = mkdtempSync(join(tmpdir(), "kanji-font-"));
try {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const tgz = execFileSync(npm, ["pack", FONT_PACKAGE, "--pack-destination", tmp, "--silent"], { encoding: "utf8", shell: process.platform === "win32" }).trim().split("\n").pop();
  execFileSync("tar", ["xzf", join(tmp, tgz), "-C", tmp]);
  const python = process.platform === "win32" ? "python" : "python3";
  execFileSync(python, [join(ROOT, "scripts", "subset-yuji-site.py"), join(tmp, FONT_FILE)], { stdio: "inherit", cwd: ROOT });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(`kanji-font: ${fingerprint() === before ? "unchanged" : "changed"}`);
