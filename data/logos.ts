/*
 * Logos for every organisation, platform and tool the site names — the
 * companies in the experience timeline, the places I taught, certificate
 * issuers, training platforms and the tools in projects and cases.
 *
 * Each logo is drawn from the first of these that exists:
 *   1. a file in public/Assets/logos/<slug>.svg|webp|png|jpg (drop the
 *      official logo there and run `npm run logos` — or just build/dev,
 *      which run it for you);
 *   2. the brand mark from the simple-icons package (`icon`, CC0, generated
 *      into components/ui/logo-data.ts at build time — no runtime package);
 *   3. a monogram (`mono`) in the site's own style.
 *
 * Client-safe: no imports from the case data.
 */

export type LogoSpec = {
  /** File name in public/Assets/logos/ (without the extension) */
  slug: string;
  /** Full name — used as the accessible label */
  label: string;
  /** 1–4 characters shown when there is no logo file or brand mark */
  mono: string;
  /** simple-icons export name (siHuawei …) — scripts/generate-logos.mjs reads these */
  icon?: string;
};

export const LOGOS: Record<string, LogoSpec> = {
  /* ── Companies, institutes and universities ── */
  "banque-misr": { slug: "banque-misr", label: "Banque Misr", mono: "BM" },
  nti: { slug: "nti", label: "National Telecommunication Institute", mono: "NTI" },
  amit: { slug: "amit", label: "AMIT Learning", mono: "AMIT" },
  depi: { slug: "depi", label: "Digital Egypt Pioneers Initiative", mono: "DEPI" },
  ischool: { slug: "ischool", label: "iSchool", mono: "iS" },
  iti: { slug: "iti", label: "Information Technology Institute", mono: "ITI" },
  huawei: { slug: "huawei", label: "Huawei", mono: "HW", icon: "siHuawei" },
  gdg: { slug: "gdg", label: "Google Developer Groups", mono: "GDG", icon: "siGoogle" },
  ieee: { slug: "ieee", label: "IEEE", mono: "IEEE", icon: "siIeee" },
  "benha-university": { slug: "benha-university", label: "Benha University", mono: "BU" },
  youtube: { slug: "youtube", label: "YouTube", mono: "YT", icon: "siYoutube" },

  /* ── Certificate issuers and training platforms ── */
  ine: { slug: "ine", label: "INE", mono: "INE" },
  "red-team-leaders": { slug: "red-team-leaders", label: "Red Team Leaders", mono: "RTL" },
  "red-hat": { slug: "red-hat", label: "Red Hat", mono: "RH", icon: "siRedhat" },
  cisco: { slug: "cisco", label: "Cisco", mono: "CS", icon: "siCisco" },
  tryhackme: { slug: "tryhackme", label: "TryHackMe", mono: "THM", icon: "siTryhackme" },
  hackthebox: { slug: "hackthebox", label: "Hack The Box", mono: "HTB", icon: "siHackthebox" },
  cyberdefenders: { slug: "cyberdefenders", label: "CyberDefenders", mono: "CD", icon: "siCyberdefenders" },
  cybertalents: { slug: "cybertalents", label: "CyberTalents", mono: "CT" },
  portswigger: { slug: "portswigger", label: "PortSwigger", mono: "PS", icon: "siPortswigger" },
  letsdefend: { slug: "letsdefend", label: "LetsDefend", mono: "LD" },
  arcx: { slug: "arcx", label: "arcX", mono: "arcX" },
  "mahara-tech": { slug: "mahara-tech", label: "Mahara-Tech", mono: "MT" },
  netriders: { slug: "netriders", label: "NetRiders", mono: "NR" },
  microsoft: { slug: "microsoft", label: "Microsoft", mono: "MS" },
  udemy: { slug: "udemy", label: "Udemy", mono: "U", icon: "siUdemy" },
  "oto-courses": { slug: "oto-courses", label: "OTO Courses", mono: "OTO" },
  comptia: { slug: "comptia", label: "CompTIA", mono: "CT+", icon: "siComptia" },
  owasp: { slug: "owasp", label: "OWASP", mono: "OW", icon: "siOwasp" },
  aws: { slug: "aws", label: "Amazon Web Services", mono: "AWS" },

  /* ── Security tools ── */
  wazuh: { slug: "wazuh", label: "Wazuh", mono: "WZ" },
  splunk: { slug: "splunk", label: "Splunk", mono: "SP", icon: "siSplunk" },
  elastic: { slug: "elastic", label: "Elastic", mono: "EL", icon: "siElastic" },
  kibana: { slug: "kibana", label: "Kibana", mono: "KB", icon: "siKibana" },
  qradar: { slug: "qradar", label: "IBM QRadar", mono: "QR" },
  suricata: { slug: "suricata", label: "Suricata", mono: "SU" },
  zeek: { slug: "zeek", label: "Zeek", mono: "ZK" },
  yara: { slug: "yara", label: "YARA", mono: "YR" },
  thehive: { slug: "thehive", label: "TheHive", mono: "TH" },
  sysmon: { slug: "sysmon", label: "Sysmon", mono: "SM" },
  mitre: { slug: "mitre", label: "MITRE ATT&CK", mono: "ATT" },
  virustotal: { slug: "virustotal", label: "VirusTotal", mono: "VT", icon: "siVirustotal" },
  "burp-suite": { slug: "burp-suite", label: "Burp Suite", mono: "BS", icon: "siBurpsuite" },
  metasploit: { slug: "metasploit", label: "Metasploit", mono: "MSF", icon: "siMetasploit" },
  wireshark: { slug: "wireshark", label: "Wireshark", mono: "WS", icon: "siWireshark" },
  "kali-linux": { slug: "kali-linux", label: "Kali Linux", mono: "KL", icon: "siKalilinux" },
  linux: { slug: "linux", label: "Linux", mono: "LX", icon: "siLinux" },
  windows: { slug: "windows", label: "Windows", mono: "WIN" },
  pfsense: { slug: "pfsense", label: "pfSense", mono: "PF", icon: "siPfsense" },
  python: { slug: "python", label: "Python", mono: "PY", icon: "siPython" },
  docker: { slug: "docker", label: "Docker", mono: "DK", icon: "siDocker" },
  vmware: { slug: "vmware", label: "VMware", mono: "VM", icon: "siVmware" },
  bash: { slug: "bash", label: "Bash", mono: "SH", icon: "siGnubash" },
  git: { slug: "git", label: "Git", mono: "GIT", icon: "siGit" },
  github: { slug: "github", label: "GitHub", mono: "GH", icon: "siGithub" },
  vim: { slug: "vim", label: "Vim", mono: "VI", icon: "siVim" },
  sqlite: { slug: "sqlite", label: "SQLite", mono: "SQL", icon: "siSqlite" },
  "tor-project": { slug: "tor-project", label: "Tor Project", mono: "TOR", icon: "siTorproject" },
  whatsapp: { slug: "whatsapp", label: "WhatsApp", mono: "WA", icon: "siWhatsapp" },
  gmail: { slug: "gmail", label: "Gmail", mono: "GM", icon: "siGmail" },
};

/* Names as they are written across the data files → a LOGOS key. Tested in
   order against the lower-cased name; the first match wins. */
const MATCHERS: readonly [RegExp, keyof typeof LOGOS][] = [
  [/banque misr/, "banque-misr"],
  [/national telecommunication|\bnti\b/, "nti"],
  [/\bamit\b/, "amit"],
  [/\bdepi\b|digital egypt pioneers/, "depi"],
  [/ischool/, "ischool"],
  [/mahara/, "mahara-tech"],
  [/cybertalents/, "cybertalents"],
  [/oto courses/, "oto-courses"],
  [/information technology institute|\biti\b/, "iti"],
  [/huawei|hcia|hccda/, "huawei"],
  [/google developer|\bgdg\b/, "gdg"],
  [/\bieee\b/, "ieee"],
  [/benha university/, "benha-university"],
  [/youtube/, "youtube"],
  [/red team leaders/, "red-team-leaders"],
  [/^ine\b|\bine security\b|\bine \(/, "ine"],
  [/red hat|\brh1\d\d\b/, "red-hat"],
  [/cisco|ccna/, "cisco"],
  [/tryhackme|\bthm\b/, "tryhackme"],
  [/hack ?the ?box|\bhtb\b/, "hackthebox"],
  [/cyberdefenders/, "cyberdefenders"],
  [/portswigger|web security academy/, "portswigger"],
  [/letsdefend/, "letsdefend"],
  [/\barcx\b/, "arcx"],
  [/netriders/, "netriders"],
  [/microsoft|outlook/, "microsoft"],
  [/udemy/, "udemy"],
  [/comptia|security\+/, "comptia"],
  [/owasp/, "owasp"],
  [/\baws\b|amazon/, "aws"],
  [/wazuh/, "wazuh"],
  [/splunk/, "splunk"],
  [/kibana/, "kibana"],
  [/elastic/, "elastic"],
  [/qradar/, "qradar"],
  [/suricata/, "suricata"],
  [/\bzeek\b/, "zeek"],
  [/\byara\b/, "yara"],
  [/thehive/, "thehive"],
  [/sysmon/, "sysmon"],
  [/mitre|att&ck/, "mitre"],
  [/virustotal/, "virustotal"],
  [/burp/, "burp-suite"],
  [/metasploit/, "metasploit"],
  [/wireshark/, "wireshark"],
  [/\bkali\b/, "kali-linux"],
  [/pfsense/, "pfsense"],
  [/windows/, "windows"],
  [/python/, "python"],
  [/docker/, "docker"],
  [/vmware/, "vmware"],
  [/\bbash\b|ssh \/ linux cli/, "bash"],
  [/^git\b|git cola/, "git"],
  [/github/, "github"],
  [/^vim$/, "vim"],
  [/sqlite/, "sqlite"],
  [/\btor\b/, "tor-project"],
  [/whatsapp/, "whatsapp"],
  [/gmail/, "gmail"],
  [/linux|auditd|\bubuntu\b/, "linux"],
];

/** The logo for a name as written in the data ("Huawei ICT Academy", "Burp Suite Repeater" …) */
export function logoFor(name: string | undefined | null): LogoSpec | undefined {
  if (!name) return undefined;
  const key = name.toLowerCase().trim();
  if (LOGOS[key]) return LOGOS[key];
  for (const [re, slug] of MATCHERS) if (re.test(key)) return LOGOS[slug];
  return undefined;
}

/** The first few distinct logos for a list of names (a project's stack, a case's tools) */
export function logosFor(names: readonly string[], limit = 6): LogoSpec[] {
  const seen = new Set<string>();
  const out: LogoSpec[] = [];
  for (const n of names) {
    const logo = logoFor(n);
    if (!logo || seen.has(logo.slug)) continue;
    seen.add(logo.slug);
    out.push(logo);
    if (out.length >= limit) break;
  }
  return out;
}
