/*
 * "Start here": three reports for a reviewer with five minutes — detection
 * engineering, a full DFIR investigation and malware analysis.
 * Ids from data/cases.ts.
 */

type StartHereEntry = {
  id: string;
  /** A short display name — it need not be the report's full title */
  label: string;
  /** Why this is the first thing to read — one line, phrased as "what you will see" */
  why: string;
  /** Approximate reading time */
  minutes: number;
};

export const startHere: readonly StartHereEntry[] = [
  {
    id: "3omda-custom-detection-rules",
    label: "Custom Wazuh detection rules",
    why: "52 automatic alarms I wrote for the Wazuh security system — they catch password guessing, ransomware, data theft and more, each linked to the attack it watches for.",
    minutes: 17,
  },
  {
    id: "data-exfiltration-investigation",
    label: "Data exfiltration & credential compromise",
    why: "A full investigation of stolen data: rebuilding, from a computer's memory, how files were copied to a USB stick and how passwords were stolen — with a minute-by-minute timeline.",
    minutes: 16,
  },
  {
    id: "malware-analysis-wannacry",
    label: "WannaCry analysis & response",
    why: "Taking apart a version of WannaCry, the ransomware that hit 200,000+ computers in 2017: what it does, how to detect it, and how to protect against it.",
    minutes: 27,
  },
];
