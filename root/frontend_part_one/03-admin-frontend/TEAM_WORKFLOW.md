# UniEvent five-person Git workflow

The project is one Next.js app. Keep it in one repository so every branch has the
same package setup and can run as a complete app. The folders below are ownership
areas, not separate apps; do not move files just to match a branch name.

## Branches and ownership

| Person | Branch | Main ownership |
| --- | --- | --- |
| Person 1 | `backend` | Shared server foundation: `src/lib/`, `src/models/`, MongoDB integration, shared API contracts |
| Person 2 | `frontend-user` | Public/user pages and shared public UI: `src/app/page.jsx`, `src/app/registration/`, `src/app/check-status/`, `src/app/gallery/`, `src/app/ideas/`, `src/app/posters/`, public components in `src/components/` |
| Person 3 | `admin-frontend` | Admin pages and admin layout: `src/app/admin/` |
| Person 4 | `admin-backend` | API routes and admin auth/API behavior: `src/app/api/`, `middleware.js` |
| Person 5 | `integration` | Integrates branches, resolves conflicts, checks combined changes, updates shared app shell/config (`src/app/layout.jsx`, `src/app/globals.css`, `package.json`) |

Some files are shared by more than one area. Coordinate before editing shared
files, agree on API request/response shapes before frontend work depends on them,
and ask the integration owner to merge overlapping changes. Keep secrets in a
local `.env.local`; never commit environment files.

## Safe contribution loop

Start from the current `main` branch and fetch before creating your branch:

```bash
git switch main
git pull origin main
git switch -c backend
```

Use your assigned branch name in place of `backend`. Before each work session:

```bash
git fetch origin
git pull --rebase origin <your-branch>
```

Commit only your related changes, then publish the branch:

```bash
git add <your-files>
git commit -m "Describe the change"
git push -u origin <your-branch>
```

Open a pull request from your branch into `main`; do not force-push shared
branches. The integration owner should merge reviewed PRs into `main`, then each
branch owner can update their branch from `main` using `git fetch origin` and
`git rebase origin/main` (resolve conflicts locally before pushing).

## Folder map

```text
src/
  app/
    api/                 # server endpoints (admin-backend, coordinated with backend)
    admin/               # admin screens (admin-frontend)
    registration/        # public registration (frontend-user)
    check-status/        # public registration lookup (frontend-user)
    gallery/ ideas/ posters/ # public pages (frontend-user)
  components/            # shared UI; coordinate changes
  lib/                   # database, auth, and server helpers (backend)
  models/                # database models (backend)
```

## Initial branch creation (run once by the repository owner)

The owner publishes the shared starting point first, then creates the team
branches from that same commit:

```bash
git push origin main
git switch -c backend
git push -u origin backend
git switch main
git switch -c frontend-user
git push -u origin frontend-user
git switch main
git switch -c admin-frontend
git push -u origin admin-frontend
git switch main
git switch -c admin-backend
git push -u origin admin-backend
git switch main
git switch -c integration
git push -u origin integration
git switch main
```

Do this from a clean, committed `main` so every teammate starts with the same
reviewable snapshot. Existing local work should be committed or otherwise saved
before switching branches.
