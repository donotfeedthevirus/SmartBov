# SmartBov

**SmartBov** is the first phase of an IoT platform that monitors cattle well-being, developed for the *Experiência Criativa* course at **PUCPR**.  

The current codebase focuses on a **RESTful API** built with **Express 5**, **Prisma**, **Zod**, **JWT**, and **Pino**, managing ranch users, cows, wearable devices, and herd groups.

## Monorepo layout
```
apps/api     # Node.js/TypeScript REST API
apps/web     # Placeholder for the future front-end
scripts/     # Shared tooling and automation scripts
docker/      # Local infra (TimescaleDB/Postgres + Mosquitto MQTT)
````

> The workspace is managed with **pnpm**.  

## Tech stack
- **Express 5 + TypeScript** → HTTP layer  
- **Prisma ORM** → PostgreSQL/TimescaleDB integration  
- **Zod** → request validation  
- **bcrypt + JWT** → authentication  
- **Pino** → structured logging (pretty in dev)

## Getting started
1. **Install prerequisites**  
   - Node.js (v18+)  
   - pnpm  
   - Docker Desktop (or equivalent runtime)  

2. Clone the repo and install dependencies
```bash
git clone https://github.com/donotfeedthevirus/SmartBov.git
cd SmartBov
pnpm install
```

3. Create environment file

```bash
cp .env.example .env
```

4. Apply database migrations

```bash
pnpm --filter api exec prisma migrate deploy
```

5. Start the dev stack
```bash
pnpm dev
```

> This boots TimescaleDB + MQTT broker via Docker Compose and launches the API with hot reloads.

6. (Optional) Seed demo data
```bash
pnpm seed
```

> Creates an admin user: `admin@smartbov.dev / admin123`.

7. Stop containers
```bash
pnpm stop
```

---

##  Environment variables

| Variable           | Purpose                             |
| ------------------ | ----------------------------------- |
| `NODE_ENV`, `PORT` | Express runtime config              |
| `DATABASE_URL`     | Prisma connection string            |
| `MQTT_URL`         | Broker URL for device telemetry     |
| `JWT_SECRET`       | Signing key for JWT tokens          |
| `FRONTEND_URL`     | CORS origin for upcoming web client |

---

## Authentication & Authorization

- **Stateless JWT** bearer tokens
- **bcrypt** password hashing
- Middleware enforces:
  - Admins manage users
  - Ranch users manage only their own cows, devices, and groups

## API Quick Reference

| Method | Endpoint                    | Description                             | Auth           |
| ------ | --------------------------- | --------------------------------------- | -------------- |
| POST   | `/auth/register`            | Register new user (returns JWT)         | –              |
| POST   | `/auth/login`               | Login with email/password               | –              |
| POST   | `/user`                     | Create ranch/admin account (admin only) | Bearer + ADMIN |
| GET    | `/user`                     | List users (admin only)                 | Bearer + ADMIN |
| PATCH  | `/user/:id`                 | Update user                             | Bearer + ADMIN |
| DELETE | `/user/:id`                 | Soft-delete user                        | Bearer + ADMIN |
| POST   | `/cow`                      | Register cow                            | Bearer + USER  |
| GET    | `/cow`                      | List cows (owned by ranch user)         | Bearer + USER  |
| PATCH  | `/cow/:id`                  | Update cow (ownership enforced)         | Bearer + USER  |
| DELETE | `/cow/:id`                  | Soft-delete cow                         | Bearer + USER  |
| POST   | `/device`                   | Register device                         | Bearer + USER  |
| GET    | `/device`                   | List devices                            | Bearer + USER  |
| PATCH  | `/device/:id/attach/:cowId` | Attach device to cow                    | Bearer + USER  |
| DELETE | `/device/:id`               | Remove device                           | Bearer + USER  |
| POST   | `/group`                    | Create herd group                       | Bearer + USER  |
| GET    | `/group`                    | List groups                             | Bearer + USER  |
| PATCH  | `/group/:id`                | Rename group                            | Bearer + USER  |
| DELETE | `/group/:id`                | Delete group (if no active cows)        | Bearer + USER  |

> Health probe available at `/health`.

## Data model

Prisma models cover:
- **Users** (roles, soft-delete flags)
- **Cows** (linked to groups & devices)
- **Devices** (firmware, connectivity, telemetry)
- **Groups** (herd segmentation)

> Planned tables: **Measurement, Alert, BuzzerCommand, Report** for analytics, notifications, remote actions.

## Seed data
```bash
pnpm seed
```

Creates demo admin: `admin@smartbov.dev / admin123`

## Roadmap

- [ ] Populate **apps/web** with dashboard for real-time vitals and alert management
- [ ] Implement **MQTT ingestion service** → map telemetry into Measurements + Alerts
- [ ] Add **automated tests + CI pipelines**
