# Presentation Builder

Turn an idea or block of text into a structured presentation — slide headings, bullet points, speaker notes, visual recommendations, and likely audience questions.

## Stack

- Frontend: React (Vite) + Tailwind CSS
- Backend: Spring Boot (Java 21) REST API
- Database: MySQL
- Model: Groq (LLaMA) — called server-side only

## Prerequisites

- Java 21
- Node.js 18+
- Docker (for MySQL) or a local MySQL 8 instance
- A Groq API key

## Setup

### 1. Database

Start MySQL with Docker:

```bash
docker compose up -d
```

This creates the `presentation_db` database on `localhost:3306` (user `root`, password `root`).

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set `GROQ_API_KEY`. Then run:

```bash
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api` to the backend.

## API

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| POST   | `/api/presentations/generate`        | Generate a deck from text          |
| POST   | `/api/presentations/generate/upload` | Generate a deck from a document    |
| GET    | `/api/presentations`            | List past presentations        |
| GET    | `/api/presentations/{id}`       | Get one presentation by id     |
