# RuralLearn — Gamified Learning Platform for Rural Education

An engaging learning platform for rural school students with quizzes, games, rewards, leaderboards, and a teacher admin dashboard.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19 + Vite + Tailwind CSS v4  |
| Backend  | Spring Boot 3.2 + Spring Security  |
| Database | MySQL (production) / H2 (dev)      |
| Auth     | JWT                                 |

## Project Structure

```
gamified_leaderboard/
├── frontend/          # React app (port 5173)
├── backend/           # Spring Boot API (port 8080)
├── database/          # MySQL schema
└── README.md
```

## Quick Start (Development)

Uses **H2 in-memory database** by default — no MySQL setup needed to get started.

### 1. Backend

```bash
cd backend

# If Maven is installed:
mvn spring-boot:run

# Or download Maven wrapper first, then:
# mvnw spring-boot:run   (Windows: mvnw.cmd spring-boot:run)
```

API runs at `http://localhost:8080`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Demo Accounts

| Role    | Email               | Password     |
|---------|---------------------|--------------|
| Student | student@school.com  | password123  |
| Teacher | teacher@school.com  | password123  |

## Pages Built (Phase 1)

### Student Side
- **Landing Page** — Hero, features, call-to-action
- **Login / Register** — JWT auth with role-based redirect
- **Dashboard** — Points, streak, level progress, badges
- **Quizzes** — List of available quizzes from API
- **Leaderboard** — Top students ranked by points
- **Games** — Placeholder (coming in Phase 2)

### Teacher Admin
- **Overview Dashboard** — Student stats, top performers, activity
- **Students** — Full student list with progress
- **Quizzes** — Placeholder for quiz management (Phase 2)

## API Endpoints

```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me

GET  /api/student/dashboard
GET  /api/student/quizzes
GET  /api/student/quizzes/{id}
POST /api/student/quizzes/{id}/submit
GET  /api/leaderboard

GET  /api/admin/dashboard
GET  /api/admin/students
```

## Switch to MySQL

1. Create database:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. Update `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     profiles:
       active: mysql
   ```

3. Set your MySQL credentials in the `mysql` profile section.

## Next Pages (Phase 2)

Build these page-by-page with backend integration:

1. ~~**Quiz Taking Page**~~ — `/quizzes/:id` — ✅ Done
2. **Game Play Page** — `/games/:id` — interactive math/word games
3. **Teacher Quiz Creator** — `/admin/quizzes/new` — CRUD for quizzes & questions
4. **Student Profile** — `/profile` — badges, history, settings
5. **Rewards Shop** — `/rewards` — redeem points for virtual rewards

## Install Maven (if not installed)

Download from https://maven.apache.org/download.cgi or use:

```bash
# Windows (winget)
winget install Apache.Maven

# Or use SDKMAN / Chocolatey
choco install maven
```
