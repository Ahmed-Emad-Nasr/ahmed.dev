# Security Policy

## Supported Versions

Only the current version of this portfolio and blog is maintained.

| Version         | Supported |
| --------------- | --------- |
| main            | Yes       |
| older snapshots | No        |

## Reporting a Vulnerability

If you find a security issue, do not open a public issue. Send the details by email instead.

Please include:

- A short description of the issue
- Steps to reproduce, if available
- The affected page or asset path
- Any screenshots, logs, or proof of concept details that help explain the problem

## Contact

Ahmed Emad Nasr

Email: ahmed.em.nasr@gmail.com


## Disclosure

I will review responsible reports privately and work on a fix before any public disclosure.

## security.txt

The same contact details are published in the standard machine-readable place,
[`/.well-known/security.txt`](https://ahmed-emad-nasr.github.io/ahmed.dev/.well-known/security.txt)
(RFC 9116). It is generated at build time by `app/.well-known/security.txt/route.ts`;
its `Expires` date is renewed by every deployment, and the site is redeployed monthly.

## Encrypted reports (PGP)

No key is published yet. To publish one (maintainer steps):

1. Create the key on your own machine — the private key never leaves it:
   `gpg --quick-generate-key "Ahmed Emad Nasr <ahmed.em.nasr@gmail.com>" ed25519 default 2y`
2. Export the **public** key into the site:
   `gpg --armor --export ahmed.em.nasr@gmail.com > public/pgp-key.asc`
3. Copy the fingerprint from `gpg --fingerprint ahmed.em.nasr@gmail.com` into
   `PROFILE.contact.pgpFingerprint` in `data/profile.ts`.

The footer then shows a "PGP" link and `security.txt` gains its `Encryption:`
line. The build fails if the fingerprint is set but the key file is missing.

