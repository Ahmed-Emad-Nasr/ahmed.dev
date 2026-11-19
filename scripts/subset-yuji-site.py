#!/usr/bin/env python3
"""
scripts/subset-yuji-site.py — the site's own Yuji Syuku cut, split into a few
small files so each page downloads only the characters it shows.

app/fonts.ts loads Yuji Syuku through next/font, which serves it as ~120
unicode-range slices; the decorative kanji on the site touch dozens of them
because the characters are spread across the whole font.
app/fonts-yuji-site.css declares 'Yuji Syuku Site' as several @font-face
rules — one per group below — each with a unicode-range of exactly its
characters. globals.css puts that family first in the Japanese font stacks,
so the browser fetches a group's file only when the page draws one of its
characters, and never the Google slices for them. A character not in any
group falls through to next/font's slices (same font, just more requests).

Groups (worked out from the built pages in out/):
  core     — on every page (loader, cursor, nav), on 2+ sections, or on the
             home page and one other section, plus the groups too small to
             be worth their own file
  home     — only on the home page
  <name>   — only on one other section (blog, teaching, gallery …)
  extra    — in the source but not in any built page: client-only states
             (terminal, contact form, error view …)

Latin is not in the cut: the site never draws Latin in the brush face (the
Japanese stacks are only used for Japanese), so a stray Latin glyph falls
through to next/font's latin slice instead of costing every page ~30 KB.

The glyphs are the same font (Google Fonts' Yuji Syuku). Re-run after adding
or removing Japanese text — build first, then run, then build again:

    npm run build
    npm pack @expo-google-fonts/yuji-syuku   (extract the .tgz)
    pip install fonttools brotli
    python3 scripts/subset-yuji-site.py <path/to/YujiSyuku_400Regular.ttf>
"""

import collections
import pathlib
import re
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "out"
FONT_DIR = ROOT / "app" / "fonts"
OUT_CSS = ROOT / "app" / "fonts-yuji-site.css"

# Drawn on every page by client code (the loader's cycling words, the cursor's
# kanji, the nav's mobile menu), so they never show up in the static HTML.
CHROME_FILES = [
    "components/layout/AppLoader.tsx",
    "components/layout/CursorOverlay.tsx",
    "components/layout/SiteNav.tsx",
]

# Client-rendered text the static HTML does not have (the case library is
# drawn in the browser from library.json): these folders count as part of
# that section's pages.
CLIENT_SECTIONS = {
    "components/blog": "blog",
}

# A one-section group smaller than this goes into core instead (each file
# has ~1 KB of fixed overhead, a request, and a moment of fallback text).
MIN_GROUP = 4


def is_jp(o: int) -> bool:
    # Kana, kanji, CJK punctuation and full-width forms
    return 0x3000 <= o <= 0x9FFF or 0xFF00 <= o <= 0xFFEF


def chars_in(text: str) -> set[int]:
    return {ord(c) for c in text if is_jp(ord(c))}


def strip_comments(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return re.sub(r"(^|\s)//[^\n]*", r"\1", text)


def source_chars() -> set[int]:
    chars: set[int] = set()
    for d in ("app", "components", "lib", "data"):
        for f in ROOT.joinpath(d).rglob("*"):
            if f.suffix not in (".ts", ".tsx", ".css") or f.name == OUT_CSS.name:
                continue
            chars |= chars_in(strip_comments(f.read_text(encoding="utf8")))
    return chars


def section_of(page: pathlib.Path) -> str:
    rel = page.relative_to(OUT_DIR).as_posix()
    if rel == "index.html":
        return "home"
    if rel.startswith("ar/"):
        rel = rel[3:]
    name = rel.split("/")[0].removesuffix(".html")
    return "404" if name in ("_not-found", "404") else name


def page_chars() -> dict[int, set[str]]:
    """character → the sections whose built HTML shows it"""
    where: dict[int, set[str]] = collections.defaultdict(set)
    for page in OUT_DIR.rglob("*.html"):
        html = re.sub(r"<script.*?</script>", "", page.read_text(encoding="utf8"), flags=re.S)
        for c in chars_in(html):
            where[c].add(section_of(page))
    for folder, section in CLIENT_SECTIONS.items():
        for f in ROOT.joinpath(folder).rglob("*.tsx"):
            for c in chars_in(strip_comments(f.read_text(encoding="utf8"))):
                where[c].add(section)
    return where


def group(chars: set[int]) -> dict[str, set[int]]:
    where = page_chars()
    sections = set().union(*where.values())
    chrome = set().union(*(chars_in(strip_comments((ROOT / f).read_text(encoding="utf8"))) for f in CHROME_FILES))
    groups: dict[str, set[int]] = collections.defaultdict(set)
    for c in chars:
        seen = where.get(c, set())
        others = seen - {"home"}
        # On the home page and anywhere else → core: otherwise the home page
        # (the most visited) would fetch a whole section file for 2-3 glyphs
        if c in chrome or seen == sections or len(others) >= 2 or ("home" in seen and others):
            groups["core"].add(c)
        elif len(others) == 1:
            groups[next(iter(others))].add(c)
        elif seen:
            groups["home"].add(c)
        else:
            groups["extra"].add(c)
    for name in [n for n in groups if n not in ("core", "home", "extra")]:
        if len(groups[name]) < MIN_GROUP:
            groups["core"] |= groups.pop(name)
    return groups


def ranges(cps: set[int]) -> str:
    out, start, prev = [], None, None
    for cp in sorted(cps):
        if start is None:
            start = prev = cp
        elif cp == prev + 1:
            prev = cp
        else:
            out.append((start, prev))
            start = prev = cp
    if start is not None:
        out.append((start, prev))
    return ", ".join(f"U+{a:04X}" if a == b else f"U+{a:04X}-{b:04X}" for a, b in out)


def cut(src: str, cps: set[int], dest: pathlib.Path) -> None:
    opts = subset.Options()
    opts.flavor = "woff2"
    # The default features plus the vertical-text ones (writing-mode:
    # vertical-rl in globals.css). "*" would also keep every alternate form
    # the font carries (aalt, jp78, trad …): ~500 extra glyphs.
    opts.layout_features = [*subset.Options().layout_features, "vert", "vrt2", "vkrn", "vpal", "palt"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    # Hinting instructions do nothing for a display face at these sizes
    opts.hinting = False
    font = subset.load_font(src, opts)
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=sorted(cps))
    sub.subset(font)
    subset.save_font(font, str(dest), opts)


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    if not OUT_DIR.joinpath("index.html").exists():
        sys.exit("Build first (npm run build): the groups come from the pages in out/.")
    src = sys.argv[1]
    font_cmap = TTFont(src).getBestCmap()
    chars = {c for c in source_chars() | set(page_chars()) if c in font_cmap}
    groups = group(chars)
    # The space between characters inside brush text
    groups["core"].add(0x20)

    for old in FONT_DIR.glob("yuji-*.woff2"):
        old.unlink()
    order = ["core", "home", *sorted(n for n in groups if n not in ("core", "home", "extra")), "extra"]
    rules = []
    for name in order:
        if not groups.get(name):
            continue
        dest = FONT_DIR / f"yuji-site-{name}.woff2"
        cut(src, groups[name], dest)
        print(f"{dest.relative_to(ROOT)}: {len(groups[name])} characters, {dest.stat().st_size / 1024:.1f} KB")
        rules.append(
            f"/* {name}: {''.join(chr(c) for c in sorted(groups[name]) if c >= 0x3000)} */\r\n"
            "@font-face {\r\n"
            "  font-family: 'Yuji Syuku Site';\r\n"
            "  font-style: normal;\r\n"
            "  font-weight: 400;\r\n"
            "  font-display: swap;\r\n"
            f"  src: url(fonts/yuji-site-{name}.woff2) format('woff2');\r\n"
            f"  unicode-range: {ranges(groups[name])};\r\n"
            "}\r\n"
        )
    OUT_CSS.write_bytes(
        (
            "/*\r\n"
            " * Yuji Syuku, cut to the characters the site uses and split by where\r\n"
            " * they appear (generated by scripts/subset-yuji-site.py — do not edit\r\n"
            " * by hand). One family, several files: the browser fetches a file only\r\n"
            " * when the page draws a character in its unicode-range, so most pages\r\n"
            " * load just the small core file. Characters outside every range fall\r\n"
            " * through to next/font's \"Yuji Syuku\" (globals.css stacks).\r\n"
            " */\r\n\r\n" + "\r\n".join(rules)
        ).encode("utf8")
    )


if __name__ == "__main__":
    main()
