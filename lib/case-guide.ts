/*
 * lib/case-guide.ts — the plain-language layer of a case page, for readers
 * who are not in security: what kind of work this is, what the topic means,
 * what the verdict and severity mean, how this kind of problem is prevented,
 * and the jargon on the page explained. Built on the server
 * (app/blog/[slug]/page.tsx) and passed to the page as finished strings.
 *
 * Nothing here replaces the report: the case's own response steps,
 * detections and lessons are shown as written; the prevention tips below are
 * labelled as general guidance for this kind of issue.
 */

import type { CaseKind } from "@/lib/shared";

/* ── What kind of work, what topic ─────────────────────────────────────── */

export const KIND_GUIDE: Record<CaseKind, { short: string; long: string }> = {
  investigation: {
    short: "A full investigation report",
    long: "An alert or incident examined from start to finish and written up as a report — the same work a security analyst does on the job.",
  },
  project: {
    short: "A project I built",
    long: "Something I built — a lab, a set of detection rules, a playbook or a tool — with a report on how it works and what it achieved.",
  },
  lab: {
    short: "A hands-on practice lab",
    long: "A deliberately weak system, attacked with permission in a safe lab, to learn how the weakness works and how to fix it.",
  },
  note: {
    short: "Study notes",
    long: "Notes from a guided learning room: the ideas explained, with screenshots of the exercises.",
  },
};

export const CATEGORY_GUIDE: Record<string, string> = {
  "Web Security": "attacks on websites and web apps — making a site reveal data it should hide, letting someone in without the right password, or running the attacker's code on the server.",
  "SOC Analysis": "the work of a Security Operations Centre (SOC): the team that watches a company's computers around the clock, reads security alerts and decides which ones are real attacks.",
  "Incident Response": "what happens after an attack is confirmed: stop it spreading, remove the attacker, recover the systems and write down what happened.",
  "Digital Forensics": "collecting and examining digital evidence — disks, memory and logs — to rebuild exactly what happened, step by step.",
  "Malware Analysis": "taking a malicious program apart in a safe, isolated lab to learn what it does, how to detect it and how to clean it up.",
  "Email Security": "phishing and malicious emails — messages that trick people into opening a harmful file or giving away a password.",
  "Penetration Testing": "authorised hacking: attacking a system with the owner's permission to find the weak points before real attackers do.",
  "Cloud Security": "protecting systems that run in the cloud (here, AWS): who can access what, how data is stored, and how attacks are spotted.",
  "Identity & Access": "making sure only the right people can log in, and that each person reaches only what their job needs.",
  "Threat Intelligence": "researching attackers — who they are, the tools they use and the traces they leave — so defenders can spot them earlier.",
  "Network Security": "watching and protecting the traffic between computers — firewalls, intrusion detection and traffic analysis.",
  "Defensive Security": "the defender's side of security: monitoring, hardening systems and responding to attacks.",
  "Vulnerability Management": "finding known weaknesses (missing updates, unsafe settings) across many systems, ranking them by risk and fixing them in order.",
  "Wireless Security": "the security of Wi-Fi networks — how weak passwords and old encryption let attackers join or listen in.",
};

/* ── Verdict and severity, in plain words ──────────────────────────────── */

export function verdictPlain(verdict?: string): string | undefined {
  if (!verdict) return undefined;
  if (/^true positive/i.test(verdict)) return "The alert was a real attack — not a false alarm.";
  if (/^false positive/i.test(verdict)) return "The alert was a false alarm — nothing malicious happened.";
  return undefined;
}

export const SEVERITY_PLAIN: Record<string, string> = {
  Critical: "Critical — the attacker could take full control. Act immediately.",
  High: "High — serious damage is possible. Act the same day.",
  Medium: "Medium — a real problem with limited reach. Fix it soon.",
  Low: "Low — limited impact, but still worth fixing.",
};

/* ── How this kind of problem is prevented (general guidance) ──────────── */

const PREVENTION: readonly [RegExp, readonly string[]][] = [
  [/sql ?injection|\bsqli\b|union all select/, [
    "Use parameterised queries (prepared statements) — never build a database query by pasting in what the user typed.",
    "Check input on the server and give the website's database account only the rights it needs.",
    "Put a web application firewall (WAF) in front of the site and alert on attack patterns in requests.",
  ]],
  [/\bxss\b|cross-site scripting|innerhtml|document\.write/, [
    "Treat everything a user sends as text, never as code: encode it for the place it is shown (HTML, attribute, JavaScript).",
    "Avoid unsafe browser functions like innerHTML and document.write; use ones that escape by default.",
    "Add a Content-Security-Policy so injected scripts are blocked even if one slips through.",
  ]],
  [/\bxxe\b|xml external/, [
    "Switch off external entities and DTDs in the XML parser.",
    "Prefer simpler formats such as JSON where possible.",
  ]],
  [/\bssrf\b|server-side request/, [
    "Let the server fetch only from an approved list of addresses.",
    "Block the application server from internal addresses and the cloud metadata service (169.254.169.254).",
  ]],
  [/\bjwt\b/, [
    "Always check the token's signature with a strong secret key, and reject unsigned tokens.",
    "Fix the expected signing algorithm on the server instead of trusting the token's own header.",
  ]],
  [/oauth/, [
    "Confirm on the server that a login token really belongs to the account it claims.",
    "Use the authorisation-code flow (with PKCE) instead of the older implicit flow.",
  ]],
  [/\b2fa\b|two-factor|mfa bypass/, [
    "Enforce the second login step on the server — no page should open until it is passed.",
    "Tie each code to the session that asked for it, and limit the number of tries.",
  ]],
  [/password reset/, [
    "Use long, random, single-use reset links that expire quickly.",
    "Check on the server that the reset link belongs to the account being changed.",
  ]],
  [/\bidor\b|user id controlled|user-id|access control|admin functionality|user role|insecure direct/, [
    "On every request, check on the server that the logged-in user is allowed to see or change that record.",
    "Never trust IDs, roles or flags sent by the browser (in the URL, cookies or hidden fields).",
    "A hidden or hard-to-guess address is not protection — admin pages need real access checks.",
  ]],
  [/file upload|web shell|content-type/, [
    "Check uploaded files on the server by their real content, not by the name or type the browser claims.",
    "Store uploads outside the website folder, rename them, and never let them run as code.",
  ]],
  [/command injection|os command|xp_cmdshell/, [
    "Never pass what a user typed to the system shell; use safe library functions instead.",
    "If a command is unavoidable, allow only known-good values.",
  ]],
  [/information disclosure/, [
    "Switch off detailed error messages and debug pages on live servers.",
    "Remove backup files, comments and version numbers from public pages.",
  ]],
  [/phish|macro|\.docm|\.rtf|attachment|spoof|malicious email|email security/, [
    "Teach staff to report unexpected attachments and links instead of opening them.",
    "Block macros in documents that come from the internet, and filter risky attachments at the mail gateway.",
    "Use SPF, DKIM and DMARC so attackers cannot easily pretend to be a trusted sender.",
  ]],
  [/brute force|password spray|\bvpn\b|credential/, [
    "Turn on multi-factor authentication (MFA) for VPN, email and remote access.",
    "Slow down or lock accounts after repeated failed logins, and alert on it.",
    "Allow remote logins only from expected countries or managed devices.",
  ]],
  [/ransom|wannacry/, [
    "Keep offline, tested backups so files can be restored without paying.",
    "Install security updates quickly — WannaCry spread through a Windows flaw that already had a fix.",
    "Block file-sharing traffic (SMB, port 445) from the internet and between machines that do not need it.",
  ]],
  [/malware|trojan|backdoor|wannacry/, [
    "Keep endpoint protection (EDR / antivirus) on and updated, and block the file hashes found here.",
    "Open unknown files only in an isolated sandbox.",
    "Block the attacker's domains and IP addresses at the firewall and web proxy.",
  ]],
  [/cve-\d|unpatched|\brce\b|remote code execution|searchsploit|metasploit|nessus|openvas/, [
    "Install security updates quickly, starting with systems that face the internet.",
    "Keep a list of software and versions so a newly published flaw can be matched in minutes.",
  ]],
  [/exfiltrat|data theft|\busb\b|insider/, [
    "Limit and monitor USB storage and unusually large uploads.",
    "Give each person access only to the data their job needs, and review it regularly.",
  ]],
  [/\baws\b|cloud|\bs3\b|guardduty|\biam\b/, [
    "Grant the fewest permissions possible in IAM and review them regularly.",
    "Keep storage private and encrypted, and switch on logging (CloudTrail) and threat detection (GuardDuty).",
  ]],
  [/wireless|wi-?fi|aircrack|\bwpa/, [
    "Use WPA3 — or WPA2 with a long, random passphrase.",
    "Keep guest Wi-Fi separate from the internal network.",
  ]],
  [/active directory|kerberos|ntlm|pass-the-hash|mimikatz/, [
    "Limit admin accounts and give service accounts long, unique passwords.",
    "Watch for unusual logons and switch off old protocols such as NTLMv1.",
  ]],
  [/ctf|privilege escalation|suid|\bftp\b|ssh/, [
    "Use strong passwords, and disable anonymous FTP and password-based SSH where they are not needed.",
    "Remove unneeded SUID permissions and sudo rights, and keep the system patched.",
  ]],
];

/** General prevention tips for this kind of issue (at most `limit`) */
export function preventionTips(text: string, limit = 5): string[] {
  const hay = text.toLowerCase();
  const out: string[] = [];
  for (const [re, tips] of PREVENTION) {
    if (!re.test(hay)) continue;
    for (const tip of tips) if (!out.includes(tip)) out.push(tip);
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

/* ── The jargon on the page, explained ─────────────────────────────────── */

const GLOSSARY: readonly [RegExp, string, string][] = [
  [/\bsoc\b|security operations/i, "SOC", "Security Operations Centre — the team that watches a company's systems and handles security alerts."],
  [/\bsiem\b|wazuh|splunk|qradar/i, "SIEM", "A system that collects logs from many computers in one place and raises alerts when something looks like an attack (Wazuh and Splunk are examples)."],
  [/\bedr\b/i, "EDR", "Endpoint Detection & Response — security software on each computer that records activity and can isolate the machine."],
  [/true positive/i, "True positive", "An alert that turned out to be a real attack."],
  [/false positive/i, "False positive", "An alert that turned out to be harmless — a false alarm."],
  [/\bioc|indicator/i, "IOC", "Indicator of Compromise — a clue an attacker leaves behind, such as an IP address, a domain or a file's fingerprint (hash)."],
  [/att&ck|mitre|\bT1\d{3}/i, "MITRE ATT&CK", "A free public catalogue of attacker techniques. Each technique has an ID like T1566 (phishing), so everyone describes attacks the same way."],
  [/\bcve-/i, "CVE", "The official ID number of a publicly known security flaw, e.g. CVE-2024-3400."],
  [/cvss/i, "CVSS", "A 0–10 score for how dangerous a security flaw is; 10 is the worst."],
  [/phish/i, "Phishing", "A fake message designed to trick someone into clicking a link, opening a file or giving away a password."],
  [/ransom/i, "Ransomware", "Malware that locks (encrypts) files and demands payment to unlock them."],
  [/malware|trojan/i, "Malware", "Any program written to cause harm — steal data, spy, or give an attacker control."],
  [/\bc2\b|command[- ]and[- ]control|beacon/i, "C2", "Command and Control — the attacker's server that infected machines report to and take orders from."],
  [/exfiltrat/i, "Exfiltration", "Data being secretly copied out of an organisation."],
  [/brute[- ]force/i, "Brute force", "Guessing passwords over and over until one works."],
  [/privilege escalation|privesc/i, "Privilege escalation", "Going from a normal account to an administrator (root) account."],
  [/lateral movement/i, "Lateral movement", "An attacker moving from the first machine they broke into to other machines on the network."],
  [/persistence/i, "Persistence", "A trick that lets an attacker get back in after a reboot or password change."],
  [/\bpayload/i, "Payload", "The harmful part an attack delivers once it gets in."],
  [/exploit/i, "Exploit", "Code or steps that take advantage of a security flaw."],
  [/\bhash|sha-?256|\bmd5\b/i, "Hash", "A file's unique fingerprint. The same file always has the same hash, so it can be looked up and blocked."],
  [/defang/i, "Defanged", "An address written so it can't be clicked by accident, e.g. 84.38.130[.]118."],
  [/\byara\b/i, "YARA", "Rules that describe what a malicious file looks like, so tools can find it automatically."],
  [/sysmon/i, "Sysmon", "A free Windows tool that records detailed activity — which programs started, what they connected to."],
  [/suricata|\bids\b|intrusion detection/i, "IDS", "Intrusion Detection System — watches network traffic and alerts on known attack patterns (Suricata is one)."],
  [/firewall/i, "Firewall", "A gatekeeper that allows or blocks network traffic by rules."],
  [/forensic|dfir/i, "DFIR", "Digital Forensics & Incident Response — investigating an attack and the evidence it left."],
  [/volatility|memory dump|memory forensics/i, "Memory forensics", "Examining a copy of a computer's RAM to see what was running at the time of the attack."],
  [/macro/i, "Macro", "A small program inside an Office document. Attackers hide malware in them."],
  [/powershell/i, "PowerShell", "Windows' built-in command tool. Useful for admins — and often abused by attackers."],
  [/\bxss\b|cross-site scripting/i, "XSS", "Cross-site scripting — getting a website to run the attacker's script in other visitors' browsers."],
  [/sql ?injection|\bsqli\b/i, "SQL injection", "Typing database commands into a website's input box so the site runs them."],
  [/\bssrf\b/i, "SSRF", "Server-side request forgery — tricking a server into fetching an address the attacker chooses, often an internal one."],
  [/\bxxe\b/i, "XXE", "A trick that abuses how a server reads XML files to make it reveal its own files."],
  [/\bidor\b/i, "IDOR", "Changing an ID in a web address (e.g. user=12 to user=13) to see someone else's data."],
  [/\bjwt\b/i, "JWT", "A login token a website gives you after you sign in. If it isn't checked properly it can be forged."],
  [/oauth/i, "OAuth", "The 'Sign in with Google/Facebook' system that lets one site log you in through another."],
  [/\bwaf\b/i, "WAF", "Web Application Firewall — filters attacks before they reach a website."],
  [/virustotal/i, "VirusTotal", "A free website that checks a file, link or IP against dozens of antivirus engines at once."],
  [/sandbox/i, "Sandbox", "An isolated environment where a suspicious file can be run safely."],
  [/burp/i, "Burp Suite", "A tool that sits between the browser and a website so a tester can see and change every request."],
  [/\bmfa\b|multi-factor|\b2fa\b/i, "MFA", "Multi-factor authentication — a second proof at login, like a code on your phone."],
  [/\biam\b/i, "IAM", "Identity & Access Management — controlling who can log in and what each account may do."],
  [/nist 800-61|nist sp 800-61/i, "NIST 800-61", "The standard incident-response playbook: prepare, detect, contain, remove, recover, learn."],
  [/\bcontain(?:ment|ed)\b|isolat/i, "Containment", "Cutting off the attack so it can't spread — for example, isolating an infected computer from the network."],
  [/triage/i, "Triage", "Quickly deciding how serious an alert is and what to do first."],
  [/registry/i, "Registry", "Windows' central settings database. Attackers change it to make malware start automatically."],
];

export type GlossaryEntry = { term: string; meaning: string };

/** The terms that actually appear in this case, explained (at most `limit`) */
export function glossaryFor(text: string, limit = 14): GlossaryEntry[] {
  const out: GlossaryEntry[] = [];
  for (const [re, term, meaning] of GLOSSARY) {
    if (re.test(text)) out.push({ term, meaning });
    if (out.length >= limit) break;
  }
  return out;
}

/* ── Everything a case page needs, in one object ───────────────────────── */

export type CaseGuide = {
  kind: CaseKind;
  /** "A hands-on practice lab" */
  kindShort: string;
  /** What this kind of work is */
  kindLong: string;
  /** What the topic is, in one sentence */
  topic?: string;
  verdict?: string;
  severity?: string;
  /** General prevention for this kind of issue */
  prevention: string[];
  glossary: GlossaryEntry[];
};

export function buildCaseGuide(input: {
  kind: CaseKind;
  category: string;
  verdict?: string;
  severity?: string;
  /** Everything searchable about the case: id, title, description, tags, tools, details */
  text: string;
}): CaseGuide {
  const kind = KIND_GUIDE[input.kind];
  const topic = CATEGORY_GUIDE[input.category];
  return {
    kind: input.kind,
    kindShort: kind.short,
    kindLong: kind.long,
    topic: topic ? `The topic is ${input.category.toLowerCase()}: ${topic}` : undefined,
    verdict: verdictPlain(input.verdict),
    severity: input.severity ? SEVERITY_PLAIN[input.severity] : undefined,
    prevention: preventionTips(input.text),
    glossary: glossaryFor(input.text),
  };
}
