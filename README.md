# Garden Living MVP Vertical Slice

Implemented in this PR:
- React Native (Expo) scaffold (`apps/mobile`)
- Node backend (`apps/api`) with JWT auth
- Postgres migration system + initial migration
- Tasks feature end-to-end: create task, list today, complete task
- Streak logic derived from completed tasks in rolling 7 days
- Docker Compose setup for local development

## Structure
- `apps/api` — API server, JWT utils, repositories, migrations
- `apps/mobile` — mobile app with auth and tasks UI
- `docker-compose.yml` — Postgres + API + mobile

## Prerequisites
- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Install
```bash
npm install
npm install -w apps/api
npm install -w apps/mobile
```

## Run everything with Docker
```bash
docker compose up --build
```

## Run locally (without Docker)

### 1) Start Postgres
```bash
docker compose up -d postgres
```

### 2) Run API
```bash
cd apps/api
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/garden_living
export JWT_SECRET=super-secret
npm install
npm run migrate
npm run dev
```

### 3) Run mobile app
```bash
cd apps/mobile
export EXPO_PUBLIC_API_URL=http://localhost:4000
npm install
npm run start
```

## Tasks API (implemented)
- `POST /auth/register`
- `POST /auth/login`
- `POST /tasks` (auth)
- `GET /tasks/today` (auth)
- `POST /tasks/:taskId/complete` (auth)
- `GET /tasks/streak` (auth)
- `GET /health`

## Lint + Tests
From repo root:
```bash
npm run lint
npm run test
```

## Notes
- API uses Postgres when `pg` is installed and `DATABASE_URL` is set; otherwise it falls back to in-memory storage for development.
- Migrations are in `apps/api/migrations` and run via `npm run migrate` in `apps/api`.
