# 🎮 RuralLearn — Gamified Learning Platform for Rural Education

## 📌 Project Overview

**RuralLearn** is a gamified web-based learning platform designed to make education more engaging and accessible for rural school students. The platform combines interactive quizzes, educational games, rewards, badges, streaks, and leaderboards to motivate students and improve learning outcomes.

It also includes a **Teacher Admin Dashboard** that enables teachers to monitor student progress, manage quizzes, and track overall classroom performance through an intuitive interface.

The project aims to bridge the educational gap by providing a fun, interactive, and technology-driven learning experience.

---

# ❓ Problem Statement

Students in rural areas often face several educational challenges such as:

* Lack of engaging digital learning resources
* Low student motivation and participation
* Limited access to quality educational content
* Difficulty tracking academic progress
* Minimal interaction between teachers and students outside school hours

Traditional e-learning platforms often fail to maintain students' interest, resulting in poor engagement and learning outcomes.

There is a need for an interactive platform that encourages continuous learning while helping teachers effectively monitor student performance.

---

# 💡 Proposed Solution

**RuralLearn** introduces gamification into education by integrating learning with game mechanics.

Students can:

* Learn through interactive quizzes
* Earn points and badges
* Maintain daily learning streaks
* Level up based on performance
* Compete on leaderboards
* Track their progress

Teachers can:

* Manage student records
* Create and manage quizzes
* Monitor student performance
* View dashboard analytics
* Encourage learning through rewards and rankings

The platform creates an enjoyable and motivating learning environment while improving educational accessibility for rural students.

---

# ✨ Features

## 👨‍🎓 Student Module

* Student Registration & Login (JWT Authentication)
* Personalized Dashboard
* Interactive Quiz System
* Learning Progress Tracking
* XP Points & Rewards
* Daily Streak Tracking
* Achievement Badges
* Leaderboard Rankings
* Quiz History
* Student Profile

---

## 👩‍🏫 Teacher Admin Module

* Secure Teacher Login
* Admin Dashboard
* Student Management
* Performance Analytics
* Quiz Management
* View Leaderboards
* Activity Monitoring
* Progress Reports

---

## 🎯 Gamification Features

* Experience Points (XP)
* Daily Streak System
* Achievement Badges
* Leaderboards
* Level Progress Tracking
* Reward-Based Learning
* Interactive Educational Games (Phase 2)

---

## 📊 Dashboard Analytics

* Student Performance
* Quiz Scores
* Progress Tracking
* Top Performers
* Student Activity
* Leaderboard Rankings

---

# 🛠 Technology Stack

| Layer             | Technology                            |
| ----------------- | ------------------------------------- |
| Frontend          | React 19 + Vite + Tailwind CSS v4     |
| Backend           | Spring Boot 3.2 + Spring Security     |
| Database          | MySQL (Production) / H2 (Development) |
| Authentication    | JWT Authentication                    |
| API               | REST APIs                             |
| Build Tools       | Maven, npm                            |
| Development Tools | VS Code, IntelliJ IDEA, Postman, Git  |

---

# ⚙️ Setup & Usage Instructions

## Project Structure

```
gamified_leaderboard/

├── frontend/          # React App (Port 5173)
├── backend/           # Spring Boot API (Port 8080)
├── database/          # MySQL Schema
└── README.md
```

---

## Backend Setup

```
cd backend

mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

By default, the project uses the **H2 in-memory database**, so no MySQL configuration is required for development.

---

## Frontend Setup

```
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Demo Accounts

### Student

Email:

```
student@school.com
```

Password:

```
password123
```

### Teacher

Email:

```
teacher@school.com
```

Password:

```
password123
```

---

## Available API Endpoints

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

---

## Switching to MySQL

1. Create the database:

```
mysql -u root -p < database/schema.sql
```

2. Update:

```
backend/src/main/resources/application.yml
```

```
spring:
  profiles:
    active: mysql
```

3. Configure your MySQL username and password in the MySQL profile.

---

## Future Enhancements

* Interactive Math & Word Games
* Teacher Quiz Creator
* Student Rewards Shop
* Student Profile Management
* AI Personalized Learning
* AI Quiz Generator
* Regional Language Support
* Mobile App Support
* Offline Learning Mode

---

# 👥 Team Details

| Name           | Role                 |
| -------------- | -------------------- |
| Afsana Mujawar | Full Stack Developer |
|Aishwarya Antre | Frontend Developer   |
| Vasudha Desai  | Backend Developer    |
| Pooja Sulgekar | UI/UX & Testing      |

Project video link-
https://www.loom.com/share/e185ce0171c846f0a04649c621376303

---

# 🏆 Project Tagline

**"Learn • Play • Achieve — Empowering Rural Education Through Gamification."**
