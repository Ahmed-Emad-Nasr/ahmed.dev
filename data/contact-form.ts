/*
 * ═══ data/contact-form.ts — where the contact form's messages go ═══
 *
 * The form on the home page (#contact, components/layout/ContactFooter.tsx)
 * sends through Web3Forms (web3forms.com, free plan: 250 messages a month):
 * the browser posts the message to their API and it arrives at the e-mail
 * address the access key was made with — no server of our own.
 *
 * The access key is MEANT to be in the page (Web3Forms is built for static
 * sites; the key only says "send to that inbox"). Someone copying it can
 * only send mail to Ahmed. To change the inbox: make a new key at
 * web3forms.com and paste it below.
 *
 * If a send fails (offline, the monthly limit reached, Web3Forms down), the
 * form falls back to the old way: it opens the visitor's mail app and offers
 * Gmail / "copy message" — a message is never lost.
 *
 * The API's address must stay in connect-src (lib/security.ts).
 */

export const WEB3FORMS_ACCESS_KEY = "29bfdb9a-0535-4ef6-a609-5f11926b0a20";
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
/* The sender name on the notification e-mail */
export const FORM_FROM_NAME = "ahmed.dev — contact form";
