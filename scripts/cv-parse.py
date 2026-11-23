# Requires: pip install pdfplumber   (requirements.txt)
"""Reads the CV PDF and prints its content as JSON (used by scripts/sync-cv.mjs).

    python scripts/cv-parse.py public/Assets/cv/AhmedEmadNasr_CV.pdf

Works on any one-column CV with the usual sections (Education, Experience,
Projects, Skills, Certifications, Volunteering, Awards, Languages — common
other names too, e.g. "Professional Experience", "Honors & Awards"):

  * section headings are found by their name
  * an entry is its heading lines (title / organisation on the left, dates
    and place on the right) followed by its bullet points
  * bold text is kept as **bold** (the site shows the same bold numbers)
  * links (GitHub, demo) are read from the PDF's clickable areas

It only reads. Deciding what the site uses — and refusing a CV it could not
read properly — is done by scripts/sync-cv.mjs. Exit code 0 with JSON on
stdout, or 1 with the reason on stderr.
"""
import json
import re
import statistics
import sys
import unicodedata

try:
    import pdfplumber
except ImportError:
    print("cv-parse: needs  pip install pdfplumber", file=sys.stderr)
    sys.exit(1)

MONTH = r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?"
DATE = rf"(?:{MONTH}\s+\d{{4}}|\d{{1,2}}/\d{{4}}|\d{{4}})"
DATE_RE = re.compile(rf"^{DATE}(?:\s*(?:–|—|-|to)\s*(?:{DATE}|Present|Now|Current|Today))?$", re.I)
YEAR_RE = re.compile(r"\b((?:19|20)\d{2})\b")
BULLETS = "•◦▪‣∙●○■□➢►–-*·"

SECTIONS = {
    "summary": ["summary", "profile", "professional summary", "about", "about me", "objective", "career objective"],
    "education": ["education", "academic background", "education and training", "academics"],
    "experience": ["experience", "work experience", "professional experience", "employment", "employment history",
                   "work history", "internships", "experience and internships", "relevant experience"],
    "projects": ["projects", "personal projects", "key projects", "selected projects", "academic projects", "technical projects"],
    "skills": ["skills", "technical skills", "core skills", "skills and tools", "technical proficiencies",
               "core competencies", "tools and technologies", "skills and expertise"],
    "certifications": ["certifications", "certificates", "licenses and certifications", "certifications and training",
                       "courses and certifications", "certifications and courses", "professional certifications",
                       "licences and certifications"],
    "volunteering": ["volunteering", "volunteer experience", "volunteer work", "leadership and volunteering",
                     "volunteering and leadership", "leadership", "extracurricular activities"],
    "awards": ["awards", "awards and achievements", "honors and awards", "achievements", "honors", "honours",
               "awards and honors", "achievements and awards", "accomplishments"],
    "languages": ["languages", "language"],
}
ALIAS = {name: key for key, names in SECTIONS.items() for name in names}


def norm_heading(text):
    t = strip_bold(text).lower().replace("&", " and ")
    return re.sub(r"\s+", " ", re.sub(r"[^a-z ]", " ", t)).strip()


def strip_bold(s):
    return s.replace("**", "")


def clean(s):
    # Ligatures a PDF may still carry (ﬁ, ﬂ …) and spacing
    s = "".join(unicodedata.normalize("NFKC", c) if "ﬀ" <= c <= "ﬆ" else c for c in s)
    s = re.sub(r"\*\*\*\*", "", s)            # a bold run split in two, joined
    s = re.sub(r"\*\*(\s*)\*\*", r"\1", s)   # empty bold runs
    return re.sub(r"\s+", " ", s).strip()


def is_bold(fontname):
    f = fontname.split("+")[-1]
    return bool(re.search(r"bold|black|heavy|semibold|demi|-bx|cmbx|\bbx|,b\b|-b$|medium", f, re.I))


def is_italic(fontname):
    f = fontname.split("+")[-1]
    return bool(re.search(r"italic|oblique|-it\b|cmti|-ti\b|slanted", f, re.I))


# ─── Lines ────────────────────────────────────────────────────────────────────

def read_lines(pdf):
    """Every text line of every page, top to bottom, split into its segments
    (a big horizontal gap separates the left part from the right-aligned part)."""
    lines, links = [], []
    offset = 0.0
    for page in pdf.pages:
        for h in page.hyperlinks or []:
            uri = h.get("uri")
            if uri:
                links.append({"uri": uri, "top": h["top"] + offset, "bottom": h["bottom"] + offset, "x0": h["x0"], "x1": h["x1"]})
        chars = [c for c in page.chars if c["text"].strip() or c["text"] == " "]
        sizes = [c["size"] for c in chars if c["text"].strip()]
        small = statistics.median(sizes) * 0.75 if sizes else 0
        rows = []
        # Text rows by baseline; small glyphs (a bullet raised to the middle
        # of the line) join the row they sit inside
        for c in sorted((c for c in chars if c["size"] >= small), key=lambda c: (c["bottom"], c["x0"])):
            for r in rows:
                if abs(r["base"] - c["bottom"]) <= max(1.5, c["size"] * 0.2):
                    r["chars"].append(c)
                    r["top"] = min(r["top"], c["top"])
                    break
            else:
                rows.append({"base": c["bottom"], "top": c["top"], "chars": [c]})
        for c in (c for c in chars if c["size"] < small):
            mid = (c["top"] + c["bottom"]) / 2
            near = [r for r in rows if r["top"] - 1 <= mid <= r["base"] + 1]
            if near:
                min(near, key=lambda r: abs((r["top"] + r["base"]) / 2 - mid))["chars"].append(c)
            else:
                rows.append({"base": c["bottom"], "top": c["top"], "chars": [c]})
        for r in rows:
            r["mid"] = r["base"]
        for r in sorted(rows, key=lambda r: r["mid"]):
            cs = sorted(r["chars"], key=lambda c: c["x0"])
            line = build_line(cs, offset)
            if line:
                lines.append(line)
        offset += float(page.height)
    return lines, links


def build_line(cs, offset):
    segments, cur, prev = [], None, None
    for c in cs:
        if c["text"] == " ":
            prev = c
            continue
        gap = c["x0"] - prev["x1"] if prev else 0
        if cur is None or gap > max(14.0, c["size"] * 1.6):
            cur = {"chars": [], "x0": c["x0"], "x1": c["x1"]}
            segments.append(cur)
        elif prev is not None and gap > c["size"] * 0.16:
            cur["chars"].append({"text": " ", "fontname": c["fontname"], "size": c["size"]})
        cur["chars"].append(c)
        cur["x1"] = c["x1"]
        prev = c
    out = []
    for seg in segments:
        text, bold = "", False
        for c in seg["chars"]:
            b = c["text"] != " " and is_bold(c["fontname"])
            if c["text"] != " " and b != bold:
                # a bold run closes before the space that follows it
                text = text[:-1] + "** " if bold and text.endswith(" ") else text + "**"
                bold = b
            text += c["text"]
        if bold:
            text += "**"
        real = [c for c in seg["chars"] if c["text"] != " "]
        out.append({
            "text": clean(text),
            "x0": seg["x0"],
            "x1": seg["x1"],
            "bold": sum(is_bold(c["fontname"]) for c in real) / max(1, len(real)),
            "italic": sum(is_italic(c["fontname"]) for c in real) / max(1, len(real)),
        })
    if not out:
        return None
    real = [c for c in cs if c["text"].strip()]
    return {
        "segments": out,
        "top": min(c["top"] for c in real) + offset,
        "bottom": max(c["bottom"] for c in real) + offset,
        "x0": out[0]["x0"],
        "size": statistics.median(c["size"] for c in real),
        "text": " ".join(s["text"] for s in out),
    }


def bullet_of(line):
    """The line's text without its bullet, or None when it is not a bullet line."""
    t = line["segments"][0]["text"]
    plain = strip_bold(t)
    if plain[:1] in BULLETS and (len(plain) == 1 or plain[1] == " "):
        rest = t.replace(plain[0], "", 1).strip() if not t.startswith("**") else t.replace(plain[0], "", 1).replace("** **", " ").strip()
        rest = clean(rest.lstrip("*").strip() if rest.startswith("** ") else rest)
        segs = [rest] + [s["text"] for s in line["segments"][1:]]
        return clean(" ".join(s for s in segs if s))
    return None


# ─── Sections ─────────────────────────────────────────────────────────────────

def split_sections(lines):
    body = statistics.median(l["size"] for l in lines)
    margin = min(l["x0"] for l in lines)
    sections, current = {"header": []}, "header"
    for l in lines:
        key = ALIAS.get(norm_heading(l["text"]))
        looks_heading = len(l["segments"]) == 1 and len(strip_bold(l["text"])) < 45 and (
            l["size"] >= body * 1.08 or strip_bold(l["text"]).isupper())
        # A section name: larger, CAPITALS, bold, or alone at the left margin —
        # never a wrapped word inside a point that happens to be "Languages"
        standalone = len(l["segments"]) == 1 and (
            looks_heading or l["segments"][0]["bold"] > 0.6 or l["x0"] <= margin + 3)
        if key and standalone and not bullet_of(l):
            current = key
            sections.setdefault(current, [])
            continue
        if looks_heading and current != "header" and not bullet_of(l) and not DATE_RE.match(strip_bold(l["text"])):
            # A heading the site has no place for (e.g. "Publications"): skip its lines
            if l["size"] >= body * 1.12:
                current = "other"
                sections.setdefault(current, [])
                continue
        sections.setdefault(current, []).append(l)
    return sections


def group_points(lines):
    """Bullet points, a wrapped line joined to the point above it."""
    points, indent = [], None
    for l in lines:
        b = bullet_of(l)
        if b is not None:
            points.append(b)
            indent = l["segments"][0]["x0"]
        elif points and indent is not None and l["x0"] >= indent - 1:
            points[-1] = clean(points[-1] + " " + l["text"])
        else:
            points.append(l["text"])
    return [p for p in points if strip_bold(p)]


def is_date(s):
    return bool(DATE_RE.match(strip_bold(s).strip()))


def entries(lines):
    """Heading lines then bullets → [{a, b, dates, place, points, a_bold, b_bold}]"""
    out, cur, in_points = [], None, False
    bullet_x = None
    for l in lines:
        b = bullet_of(l)
        if b is not None:
            if cur is None:
                cur = {"head": [], "lines": []}
                out.append(cur)
            cur["lines"].append(l)
            in_points = True
            bullet_x = l["segments"][0]["x0"]
            continue
        wrapped = in_points and bullet_x is not None and l["x0"] > bullet_x + 2 and len(l["segments"]) == 1
        if wrapped:
            cur["lines"].append(l)
            continue
        if cur is None or in_points:
            cur = {"head": [], "lines": []}
            out.append(cur)
            in_points = False
        cur["head"].append(l)
    result = []
    for e in out:
        lefts, rights, bolds = [], [], []
        for h in e["head"]:
            lefts.append(strip_bold(h["segments"][0]["text"]))
            bolds.append(h["segments"][0]["bold"] > 0.6)
            rights.extend(strip_bold(s["text"]) for s in h["segments"][1:])
        dates = next((r for r in rights if is_date(r)), "")
        place = next((r for r in rights if r != dates), "")
        if not dates:
            for i, t in enumerate(lefts):
                m = re.search(rf"({DATE}(?:\s*(?:–|—|-|to)\s*(?:{DATE}|Present|Now|Current))?)\s*$", t, re.I)
                if m and len(t) > len(m.group(1)):
                    dates, lefts[i] = m.group(1), t[: m.start()].strip(" ,|–-")
                    break
        result.append({
            "a": lefts[0] if lefts else "",
            "b": lefts[1] if len(lefts) > 1 else "",
            "a_bold": bolds[0] if bolds else False,
            "b_bold": bolds[1] if len(bolds) > 1 else False,
            "dates": dates.replace("--", "–").replace(" - ", " – ").replace("—", "–"),
            "place": place,
            "points": group_points(e["lines"]),
        })
    return [r for r in result if r["a"]]


def links_on(line, links, margin=2.0):
    return [k["uri"] for k in links if k["top"] - margin <= line["bottom"] and k["bottom"] + margin >= line["top"]]


LINK_WORDS = r"(?:GitHub|Git|Code|Repo|Source|Demo|Live|Video|Videos|YouTube|Playlist|Watch|Website|Site|Link|Paper|Docs)"
TRAILING_LINKS = re.compile(rf"(?:\s*[|·•,]?\s*{LINK_WORDS})+\s*$", re.I)


def projects(lines, links):
    out = []
    for e in entries(lines):
        # "GitHub | Demo" written right after a long stack is a link label, not part of it
        a = TRAILING_LINKS.sub("", e["a"]).strip(" |")
        e = {**e, "a": a}
        title, _, stack = e["a"].partition(" | ")
        if not stack:
            for sep in (" — ", " – ", ": "):
                if sep in title:
                    title, _, stack = title.partition(sep)
                    break
        out.append({"title": title.strip(), "stack": stack.strip(), "dates": e["dates"], "points": e["points"], "_a": e["a"]})
    # Links: those on each project's heading line
    heads = [l for l in lines if bullet_of(l) is None]
    for p in out:
        line = next((l for l in heads if strip_bold(l["segments"][0]["text"]).startswith(p["_a"][:25])), None)
        uris = links_on(line, links) if line else []
        p["github"] = next((u for u in uris if "github.com" in u), "")
        p["demo"] = next((u for u in uris if "github.com" not in u and not u.startswith("mailto:")), "")
        del p["_a"]
    return out


def skills(lines):
    rows = []
    for l in lines:
        t = bullet_of(l) or l["text"]
        plain = strip_bold(t)
        if ":" in plain and plain.index(":") < 60:
            label, _, value = plain.partition(":")
            rows.append([label.strip(), value.strip()])
        elif rows:
            rows[-1][1] = clean(rows[-1][1] + " " + plain)
    return rows


def certifications(lines):
    items, buf = [], ""
    for l in lines:
        b = bullet_of(l)
        text = strip_bold(b if b is not None else " ".join(s["text"] for s in l["segments"]))
        if buf and (b is not None or YEAR_RE.search(buf)):
            items.append(buf)
            buf = ""
        buf = clean(f"{buf} {text}")
    if buf:
        items.append(buf)
    out = []
    for it in items:
        year = ""
        m = re.search(r"\(?\b((?:19|20)\d{2})\b\)?\s*$", it)
        if m:
            year, it = m.group(1), it[: m.start()].strip(" ,|–—-")
        name, issuer = it, ""
        for sep in (" – ", " — ", " -- ", " - ", " | ", ", "):
            if sep in it:
                name, _, issuer = it.rpartition(sep)
                break
        out.append([name.strip(), issuer.strip(), year])
    return out


def languages(lines):
    text = strip_bold(" ".join((bullet_of(l) or l["text"]) for l in lines))
    parts = [p for p in re.split(r"\s*[|;•·]\s*|,\s*(?![^()]*\))", text) if p.strip()]
    out = []
    for p in parts:
        m = re.match(r"^(.+?)\s*(?::|–|—|-|\()\s*(.+?)\)?$", p.strip())
        out.append([m.group(1).strip(), m.group(2).strip()] if m else [p.strip(), ""])
    return out


def header(lines, links):
    texts = [strip_bold(l["text"]) for l in lines]
    allt = " ".join(texts)
    uris = [k["uri"] for k in links if lines and k["top"] <= lines[-1]["bottom"] + 2]
    email = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", allt)
    phone = re.search(r"\+?\d[\d ()-]{8,}\d", allt)
    # The line under the name that is not contact details or a link
    headline = ""
    for l, t in list(zip(lines, texts))[1:]:
        if links_on(l, links, 0) or re.search(r"@|\+?\d{6,}|https?:|\.com|\.io|linkedin|github", t, re.I):
            continue
        if len(t.split()) >= 2:
            headline = t
            break
    pick = lambda pat: next((u for u in uris if re.search(pat, u, re.I)), "")
    return {
        "name": texts[0] if texts else "",
        "headline": headline,
        "email": email.group(0) if email else pick(r"^mailto:").replace("mailto:", ""),
        "phone": phone.group(0).strip() if phone else "",
        "linkedin": pick(r"linkedin\.com"),
        "github": pick(r"github\.com"),
        "wuzzuf": pick(r"wuzzuf\.net"),
    }


def education(lines):
    es = entries(lines)
    if not es:
        return None
    e = es[0]
    gpa, coursework, rest = "", "", []
    for p in e["points"] + [e["b"]]:
        plain = strip_bold(p)
        m = re.search(r"GPA\s*[:\-]?\s*([\d.]+\s*/\s*[\d.]+)", plain, re.I)
        if m and not gpa:
            gpa = m.group(1).replace(" ", "")
        elif re.match(r"(relevant\s+)?course\s*work", plain, re.I):
            coursework = plain.split(":", 1)[-1].strip()
        elif p is not e["b"]:
            rest.append(p)
    return {**e, "gpa": gpa, "coursework": coursework}


def main(path):
    with pdfplumber.open(path) as pdf:
        lines, links = read_lines(pdf)
    if not lines:
        raise SystemExit("cv-parse: no text in the PDF (a scanned image?)")
    s = split_sections(lines)
    out = {"header": header(s.get("header", []), links)}
    if s.get("education"):
        out["education"] = education(s["education"])
    for key in ("experience", "volunteering"):
        if s.get(key):
            out[key] = entries(s[key])
    if s.get("projects"):
        out["projects"] = projects(s["projects"], links)
    if s.get("skills"):
        out["skills"] = skills(s["skills"])
    if s.get("certifications"):
        out["certifications"] = certifications(s["certifications"])
    if s.get("awards"):
        out["awards"] = group_points(s["awards"])
    if s.get("languages"):
        out["languages"] = languages(s["languages"])
    out["found"] = sorted(k for k in s if k not in ("header", "other"))
    json.dump(out, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    try:
        main(sys.argv[1] if len(sys.argv) > 1 else "public/Assets/cv/AhmedEmadNasr_CV.pdf")
    except SystemExit:
        raise
    except Exception as e:  # never a stack trace in the workflow log — the reason
        print(f"cv-parse: {type(e).__name__}: {e}", file=sys.stderr)
        sys.exit(1)
