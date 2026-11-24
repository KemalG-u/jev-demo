# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| latest commit on `main` | yes |
| older | no |

## Reporting a vulnerability

Please do **not** open a public issue for a security problem.

Report it privately with GitHub's private vulnerability reporting: open the repository's **Security** tab and choose **Report a vulnerability** (https://github.com/KemalG-u/jev-demo/security/advisories/new).

Include: affected version, a description, steps to reproduce, and the impact you see. Never include real secrets or personal data in a report; describe where they appear instead.

## What to expect

This is a one-person project maintained on a best-effort basis. The maintainer aims to send an initial response within 14 days of a report. A fix date is not promised; the maintainer will tell you what is planned.

## Scope

In scope: the demo application code in this repository (the Next.js page and the `/api/evaluate` route). Out of scope: weaknesses of third-party dependencies (report those upstream); the demo returns fixed example results and is not meant to hold real data.
