/*
 * ═══ lib/case-numbers.ts — a case "by the numbers" ═══
 *
 * The strip of figures at the top of every case page
 * (components/blog/CaseNumbers.tsx). SERVER-ONLY: called from
 * app/blog/[slug]/page.tsx, which hands the finished list down.
 *
 * RULE: nothing here is typed in or estimated. Every figure is counted from
 * what the case already documents —
 *   outcome.detectedIn / containedIn → data/case-details.ts (written by hand,
 *                                      only for cases where it was measured)
 *   first → last event               → the case's timeline
 *   attack steps / ATT&CK techniques → its chain + data/attack.ts
 *   detection rules                  → the rules in the report, or the Wazuh
 *                                      rules in data/detection-rules.ts that
 *                                      cover the same techniques
 *   indicators / response / evidence → its IOCs, response list, screenshots
 * — and a figure with nothing behind it is simply not shown. At most four
 * appear, in the order below.
 */

import type { CaseDetail, IocType } from "@/data/case-details";
import { detectionRules } from "@/data/detection-rules";

export type CaseNumber = {
  value: string;
  label: string;
  /** A second, smaller line */
  note?: string;
  /** Makes the tile a link (site path) */
  href?: string;
};

const MAX = 4;

/* "2024-04-18 14:15" / "2025-02-04 08:06:08 UTC" → a timestamp; null when the
   entry has no clock time (a bare date says nothing about duration) */
function clock(time: string): number | null {
  const m = time.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  return Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!, +m[4]!, +m[5]!, +(m[6] ?? 0));
}

function duration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  return min ? `${h} h ${min} min` : `${h} h`;
}

const IOC_NAME: Record<IocType, [string, string]> = {
  ip: ["IP", "IPs"],
  domain: ["domain", "domains"],
  url: ["URL", "URLs"],
  email: ["e-mail", "e-mails"],
  hash: ["hash", "hashes"],
  file: ["file", "files"],
  registry: ["registry key", "registry keys"],
  account: ["account", "accounts"],
  other: ["other", "other"],
};

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/* Languages that are a rule a SIEM / scanner can load (not a shell command) */
const RULE_LANGS = new Set(["yara", "sigma", "xml", "spl", "kql", "snort", "suricata"]);

export function caseNumbers({
  detail,
  techniques,
  screenshots,
}: {
  detail: CaseDetail | undefined;
  techniques: readonly { id: string }[];
  screenshots: number;
}): CaseNumber[] {
  const out: CaseNumber[] = [];
  if (!detail) return out;

  /* 1. Measured by hand, when the case really has it */
  if (detail.outcome?.detectedIn) out.push({ value: detail.outcome.detectedIn, label: "to detect" });
  if (detail.outcome?.containedIn) out.push({ value: detail.outcome.containedIn, label: "to contain" });

  /* 2. How long the documented activity lasted */
  const stamps = (detail.timeline ?? []).map((t) => clock(t.time)).filter((t): t is number => t !== null);
  if (stamps.length >= 2) {
    const minutes = Math.round((Math.max(...stamps) - Math.min(...stamps)) / 60000);
    /* Longer than two days is several evidence sets side by side, not one incident */
    if (minutes >= 1 && minutes <= 48 * 60) {
      out.push({ value: duration(minutes), label: "first to last event", note: `${stamps.length} timed events on the timeline` });
    }
  }

  /* 3. The attack, step by step */
  const steps = detail.chain?.length ?? 0;
  if (steps) {
    out.push({
      value: String(steps),
      label: plural(steps, "attack step traced", "attack steps traced"),
      note: techniques.length ? `mapped to ${techniques.length} ATT&CK ${plural(techniques.length, "technique", "techniques")}` : undefined,
    });
  } else if (techniques.length) {
    out.push({ value: String(techniques.length), label: `ATT&CK ${plural(techniques.length, "technique", "techniques")} mapped` });
  }

  /* 4. Detection: rules written in this report, else the library rules that
        cover the same techniques (a rule for T1110.001 covers a case tagged
        T1110, and the other way round — never a sibling technique) */
  const written = (detail.detection ?? []).filter((d) => RULE_LANGS.has(d.lang.toLowerCase()));
  if (written.length) {
    out.push({
      value: String(written.length),
      label: plural(written.length, "detection rule in this report", "detection rules in this report"),
      note: written[0]!.title.split(" — ")[0],
    });
  } else {
    const covering = detectionRules.filter((r) =>
      techniques.some((t) => r.mitre === t.id || r.mitre.startsWith(`${t.id}.`) || t.id.startsWith(`${r.mitre}.`)),
    );
    if (covering.length) {
      out.push({
        value: String(covering.length),
        label: plural(covering.length, "of my Wazuh rules covers this", "of my Wazuh rules cover this"),
        note: "same ATT&CK techniques — see the detection library",
        href: "/blog#detections",
      });
    }
  }

  /* 5. Indicators */
  const iocs = detail.iocs ?? [];
  if (iocs.length) {
    const byType = new Map<IocType, number>();
    for (const i of iocs) byType.set(i.type, (byType.get(i.type) ?? 0) + 1);
    const top = [...byType.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    out.push({
      value: String(iocs.length),
      label: plural(iocs.length, "indicator extracted", "indicators extracted"),
      note: top.map(([type, n]) => `${n} ${IOC_NAME[type][n === 1 ? 0 : 1]}`).join(" · "),
    });
  }

  /* 6. Response */
  const response = detail.response?.length ?? 0;
  if (response) out.push({ value: String(response), label: plural(response, "response action", "response actions") });

  /* 7. Evidence */
  if (screenshots) {
    out.push({
      value: String(screenshots),
      label: plural(screenshots, "evidence screenshot", "evidence screenshots"),
      note: detail.pages ? `from a ${detail.pages}-page report` : undefined,
    });
  }

  return out.slice(0, MAX);
}
