# Dehurdle Task Manager

Full-stack MERN task manager with JWT authentication, built for the DEHURDLE technical assignment.

## Live URLs

| Service  | URL |
|----------|-----|
| Frontend (Vercel) | `https://YOUR-APP.vercel.app` |
| Backend (Render)  | https://dehurdle-task-assignment.onrender.com |

Verify the API is live:

```bash
curl https://dehurdle-task-assignment.onrender.com/
# → {"message":"Dehurdle API running"}

curl https://dehurdle-task-assignment.onrender.com/tasks
# → 401 {"message":"No token, authorization denied"}
```

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend:** React (Vite), Tailwind CSS, Axios, React Router
- **Deployment:** Render (backend), Vercel (frontend)

## State Management

React Context (`AuthContext`) holds the logged-in user and JWT token in `localStorage`. Task list state lives in the Dashboard component with local `useState` — no Redux needed for this scope.

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)
- Bash (for `setup.sh` on Windows use Git Bash or WSL)

### Quick start

```bash
chmod +x setup.sh
./setup.sh              # install deps + copy backend/.env.example
./setup.sh --seed       # optional: seed sample tasks (seed@test.com / password123)
```

### Manual setup

```bash
# Backend
cd backend
cp .env.example .env    # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev             # http://localhost:5000

# Frontend (new terminal)
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000
npm install
npm run dev             # http://localhost:5173
```

### Run API tests

```bash
cd backend
npm run dev   # terminal 1
npm test      # terminal 2 — 28 endpoint tests
```

## Environment Variables

### Backend (`backend/.env`)

| Variable     | Description |
|--------------|-------------|
| `MONGO_URI`  | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `PORT`       | Server port (Render sets this automatically) |
| `CLIENT_URL` | Frontend URL(s), comma-separated for CORS |

### Frontend (`frontend/.env`)

| Variable        | Description |
|-----------------|-------------|
| `VITE_API_URL`  | Backend API base URL |

## Deployment

### Why Render + Vercel (instead of EC2)

AWS EC2 requires manual server setup, security groups, and a process manager. Render and Vercel provide managed hosting with zero server maintenance — suitable for this assignment's allowed alternatives (Railway, Render, Fly.io).

> **Note:** PM2 (`ecosystem.config.js`) is included for EC2/VPS deployments. **Render does not use PM2** — it runs `npm start` directly.

---

### Backend — Render

1. Push repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New → Web Service** → connect repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `node render-build.js`
   - **Start Command:** `npm start` (runs `start.js` — auto-fixes stale cache)
   - **Health Check Path:** `/`

   > **Important:** Do **not** use plain `npm install`. Render caches old `node_modules` — the build script deletes them first. After changing the build command, go to **Settings → Clear build cache & deploy**.
4. Environment variables:

   | Key          | Value |
   |--------------|-------|
   | `MONGO_URI`  | Your MongoDB Atlas URI |
   | `JWT_SECRET` | Strong random string |
   | `CLIENT_URL` | `https://YOUR-APP.vercel.app` |

   Or use the included `render.yaml` at repo root for Blueprint deploy.

5. Copy the Render URL (e.g. `https://dehurdle-api.onrender.com`).

**MongoDB Atlas:** Add `0.0.0.0/0` to Network Access so Render can connect.

---

### Frontend — Vercel

1. [Vercel Dashboard](https://vercel.com) → **Add New Project** → import repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Environment variable:

   | Key             | Value |
   |-----------------|-------|
   | `VITE_API_URL`  | `https://dehurdle-task-assignment.onrender.com` |

4. Deploy → copy Vercel URL.
5. Go back to Render and set `CLIENT_URL` to your Vercel URL, then redeploy the backend.

---

### PM2 (optional — EC2 / VPS only)

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## API Endpoints

| Method | Endpoint           | Auth | Description |
|--------|--------------------|------|-------------|
| GET    | `/`                | No   | Health check |
| POST   | `/auth/register`   | No   | Create account |
| POST   | `/auth/login`      | No   | Login, returns JWT |
| POST   | `/tasks`           | Yes  | Create task |
| GET    | `/tasks`           | Yes  | List tasks (`?status=todo`) |
| PATCH  | `/tasks/:id`       | Yes  | Update task |
| DELETE | `/tasks/:id`       | Yes  | Delete task |

## Git Workflow

Feature branches are pushed to GitHub and merged into `main`. See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for details.

| Branch | Assignment task |
|--------|-----------------|
| `feature/tasks-api` | Task 1 — REST API |
| `feature/auth` | Task 2 — JWT authentication |
| `feature/frontend` | Task 3 — React dashboard |
| `feature/cli-setup` | Task 5 — `setup.sh` + `--seed` |
| `feature/deployment` | Task 6 — Render deployment + README |

```bash
git branch -a                              # list all branches
git log --oneline --graph --all --decorate # visual history
```

## Project Structure

```
├── backend/          # Express API
├── frontend/         # React + Vite + Tailwind
├── setup.sh          # Local setup script
├── render.yaml       # Render Blueprint
├── ecosystem.config.js  # PM2 (EC2 only)
└── README.md
```
