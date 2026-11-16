# Requires: pip install pikepdf   (requirements.txt)
"""Give the CV PDF the title, author and keywords a search engine shows.

    npm run pdf:cv        (part of npm run prepare:assets)

Google indexes PDFs and shows the file's own Title as the result's heading;
a CV exported from Word often says "Microsoft Word - CV.docx" or nothing at
all. This writes clean metadata into public/Assets/cv/AhmedEmadNasr_CV.pdf —
both the classic Info dictionary and the XMP packet that newer readers and
Google prefer — and opens it at the first page, fit to width, with its title
in the window bar. The pages themselves are not touched.

Replace the CV with a new export of the same name and run it again; a second
run on an already-clean file changes nothing.
"""
import sys, pathlib
sys.stdout.reconfigure(errors="replace")
try:
    import pikepdf
    from pikepdf import Name
except ImportError:
    print("pdf:cv skipped: needs  pip install -r requirements.txt")
    sys.exit(0)

CV = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "public/Assets/cv/AhmedEmadNasr_CV.pdf")

META = {
    "title": "Ahmed Emad Nasr — CV | Information Security Officer",
    "author": "Ahmed Emad Nasr",
    "subject": "CV of Ahmed Emad Nasr: information security officer and cybersecurity instructor — "
               "GRC & compliance, SOC operations, incident response & DFIR, malware analysis, IAM.",
    "keywords": ["Ahmed Emad Nasr", "Ahmed Emad Nasr CV", "Ahmed Emad Nasr resume", "0x3omda",
                 "Information Security Officer", "SOC Analyst", "Incident Response", "DFIR",
                 "GRC", "Cybersecurity Instructor", "Egypt"],
}

if not CV.exists():
    print(f"pdf:cv skipped: {CV} not found")
    sys.exit(0)

with pikepdf.open(CV, allow_overwriting_input=True) as pdf:
    keywords = ", ".join(META["keywords"])
    info = pdf.docinfo
    want = {
        Name.Title: META["title"], Name.Author: META["author"], Name.Subject: META["subject"],
        Name.Keywords: keywords, Name.Creator: META["author"],
    }
    same = all(str(info.get(k, "")) == v for k, v in want.items()) and Name.Producer not in info
    if same:
        print(f"pdf:cv: {CV.name} already clean")
        sys.exit(0)

    for k, v in want.items():
        info[k] = v
    if Name.Producer in info:
        del info[Name.Producer]

    with pdf.open_metadata(set_pikepdf_as_editor=False) as xmp:
        xmp["dc:title"] = META["title"]
        xmp["dc:creator"] = [META["author"]]
        xmp["dc:description"] = META["subject"]
        xmp["dc:subject"] = META["keywords"]
        xmp["pdf:Keywords"] = keywords
        xmp["xmp:CreatorTool"] = META["author"]
        for producer in ("pdf:Producer",):
            if producer in xmp:
                del xmp[producer]

    # Open: page 1, fit to width, the title (not the file name) in the window bar
    pdf.Root.ViewerPreferences = pikepdf.Dictionary(DisplayDocTitle=True)
    pdf.Root.PageMode = Name.UseNone
    pdf.Root.OpenAction = pikepdf.Array([pdf.pages[0].obj, Name.FitH, pikepdf.objects.Object.parse(b"null")])
    if "/Lang" not in pdf.Root:
        pdf.Root.Lang = "en"

    pdf.save(CV)
    print(f"pdf:cv: {CV.name} — title, author, subject and keywords set")
