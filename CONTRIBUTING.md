# Contributing

## Branching

- Create a branch from `main` for each change.
- Keep PRs small and focused.
- Use clear commit messages, preferably Conventional Commits.

## Local Validation

Run all checks before opening a pull request:

```bash
npm ci
npm run check
npm run build:vercel
```

## Pull Request Checklist

- [ ] Code compiles with `npm run check`
- [ ] Build passes with `npm run build:vercel`
- [ ] No secrets were added
- [ ] Any user-visible change is documented in README or PR description

## Security and Integrity Rules

- Do not trust client-submitted room/team metadata.
- Do not add plaintext flags or secrets in source files.
- Do not log submitted flags, credentials, or session data.

## Scope and Quality

- Avoid unrelated refactors in the same PR.
- Preserve API behavior unless the PR explicitly includes API contract changes.
- Add or update tests when a test harness is available.
