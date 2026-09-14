Welcome — thanks for your interest in contributing!

What we accept
- Bug reports and reproducible fixes
- Feature proposals with a short design
- Documentation improvements and resource additions
- Small UI/UX and accessibility fixes

How to file an issue
- Use a clear title (short summary)
- Provide reproduction steps, expected vs actual, environment (browser/node)
- Include screenshots/console logs where relevant
- Add a label if you can (bug, enhancement, docs)

Branching & PR workflow
- Fork the repo and create a branch: feature/<short-description> or fix/<short-desc>
- Keep PRs small and focused
- Reference related issues using #<issue-number>
- Run lint and tests before opening a PR

Commit messages
- Use Conventional Commits: feat:, fix:, docs:, chore:, refactor:, style:, test:
- Keep subject <= 72 chars

Code style & tools
- Run: npm run lint
- Use Prettier defaults (format before committing)
- TypeScript types preferred for new modules/components

Tests & CI
- Add tests for new logic where reasonable
- PRs should pass lint and tests (CI expectation)

Security & secrets
- Never commit secrets or credentials. Use .env.example for env variable names.
- If you discover a security issue, contact maintainers privately before opening a public issue.

License for contributions
- By contributing, you agree to license your contributions under the project’s MIT license.

Thank you — please be respectful and helpful in reviews.
