/*
 * The CV's opening line, used as the hero description. The CV itself is the
 * PDF only (lib/shared.ts → CV_PDF_HREF); there is no HTML CV page.
 */

import { investigationReportCount, publishedCaseCount } from "@/data/cases";
import { coveredTechniqueCount } from "@/data/attack";

/** The opening line of the CV (its numbers are computed from the data) */
export const CV_SUMMARY =
  "Information security officer working across GRC and compliance, security operations, DFIR, IAM and data security. " +
  `The record so far: ${investigationReportCount} investigation reports across ${publishedCaseCount} documented cases, ` +
  `${coveredTechniqueCount()} MITRE ATT&CK techniques mapped, a detection rule merged into SOC Fortress, ` +
  "GRC gap assessments at Banque Misr, and 300+ students taught.";
