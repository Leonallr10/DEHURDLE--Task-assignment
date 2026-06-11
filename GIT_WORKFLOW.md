# Git Workflow

This project uses a **feature branch** workflow. Each assignment task was developed on its own branch and integrated into `main`.

## Branches

| Branch | Task | Tip commit | Description |
|--------|------|------------|-------------|
| `feature/tasks-api` | Task 1 | `db0b4b9` | Task model, controller, routes, MongoDB |
| `feature/auth` | Task 2 | `975e4b5` | JWT auth, bcrypt, protected routes |
| `feature/frontend` | Task 3 | `3e88688` | React dashboard, login, register, CRUD UI |
| `feature/cli-setup` | Task 5 | `7dcf388` | `setup.sh` + `--seed` bonus |
| `feature/deployment` | Task 6 | `191c585` | Render deploy, README, PM2 config |

`main` contains the full integrated application (latest: UI polish, dark mode, production fixes).

## Workflow used

```bash
# Example: Task 2 — authentication
git checkout main
git checkout -b feature/auth
# ... commits ...
git checkout main
git merge feature/auth
git push origin main feature/auth
```

## Commit message convention

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — tooling, config, deps
- `docs:` — README / documentation
- `refactor:` — code restructure without behavior change

## What is ignored

See `.gitignore`:

- `node_modules/`
- `.env` and env variants
- `dist/`, `build/` (build artifacts)

## View branch history

```bash
git log --oneline --graph --all --decorate
git branch -a
```
