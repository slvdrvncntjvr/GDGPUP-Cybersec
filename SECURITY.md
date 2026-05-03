# Security Policy

## Reporting a Vulnerability

Please report vulnerabilities privately by opening a private security advisory in GitHub or contacting project maintainers directly.

Include:

- Affected endpoint or file
- Reproduction steps
- Expected vs actual behavior
- Impact assessment
- Suggested fix if available

## Sensitive Data Handling

- Never commit `.env` or secrets.
- Never store plaintext challenge flags in client-shipped assets.
- Session cookies must remain `httpOnly`.

## Supported Hardening Baseline

Current baseline includes:

- Session regeneration on login/register
- Session destruction on logout
- Route-level auth checks for protected endpoints
- Submission abuse limits and anti-duplicate XP logic

## Non-Goals

- No bug bounty program is currently defined.
