# Contributing to prodapt

Trunk-based workflow. `main` protected — no direct pushes. All changes via PR.

## Setup

```bash
git clone https://github.com/poornaganeshd/prodapt.git
cd prodapt
```

Open in VS Code → accept "Install Recommended Extensions" prompt (from `.vscode/extensions.json`).

## Branch naming

```
feature/<short-desc>   new functionality
fix/<short-desc>       bug fix
chore/<short-desc>     tooling, deps, config
docs/<short-desc>      documentation only
```

Example: `feature/user-login-api`

## Workflow

1. Pull latest `main`: `git pull origin main`
2. Branch off: `git checkout -b feature/your-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add user login endpoint
   fix: correct null check in order service
   chore: bump spring-boot to 3.3.2
   ```
4. Push: `git push -u origin feature/your-feature`
5. Open PR into `main` via GitHub (or `gh pr create`)
6. Needs 1 approval + passing checks before merge
7. Squash-merge, delete branch after merge

## Commit types

`feat` `fix` `chore` `docs` `refactor` `test` `style` `perf`

## Code review

- Keep PRs small, one concern each
- Link related issue if any
- Reviewer: check logic, tests, no secrets committed
