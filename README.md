# BearHacks 2026 PoC

This repository contains the Proof of Concept (PoC) for the BearHacks 2026 application system. It is structured as a monorepo containing a separate Frontend (Vite + React) and Backend (Express + Bun).

## 🏗️ Structure

- **`frontend/`**: React application using Vite, TypeScript, and TailwindCSS.
- **`backend/`**: Express API using Bun, Mongoose (MongoDB), and JWT Authentication.

## 🚀 Quick Start

To run both the frontend and backend concurrently (requires Bun):

```bash
# Install dependencies for both (via root script)
bun run install:all

# OR manually
cd backend && bun install
cd ../frontend && bun install
cd ..

# Run both in parallel
bun run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🌐 Deployments

- **Frontend (Vercel)**: https://bearhacks26-devtest.vercel.app
- **Backend (Render)**: https://bearhacks26-devtest.onrender.com

## ✨ Features

- **Discord Authentication**: Secure OAuth2 login with HTTP-Only cookies.
- **Hacker Application**: Multi-step form with auto-save/update.
- **RSVP System**: Status tracking (Pending -> Accepted -> Confirmed).
- **Shared Schema**: Common validation logic in `shared/` ensuring frontend/backend parity.
- **Admin Panel**: Dashboard for organizers to review and accept applications.
    - **Login**: `/admin`
    - **Default User**: `admin`
    - **Default Pass**: `[PASSWORD]`
- **Validation**:
    - **Zod**: Type-safe schema validation for both frontend forms and backend APIs.
    - **React Hook Form**: Performance-focused form state management.
- **Logging**: Comprehensive logging for all requests and critical actions.

## 🛠️ Technology Stack

- **Runtime**: Bun (Fast JavaScript runtime)
- **Frontend**: React, Vite, TailwindCSS v4
- **Backend**: Express.js, MongoDB Atlas (Mongoose)
- **Validation**: Zod + React Hook Form
- **Security**: `bcryptjs`, `jsonwebtoken`, `cors` (SameSite=None)

## 📦 Installation & Setup

We use **Bun** for package management. Since we use a `shared/` directory, you must generally install dependencies from the root to ensure proper linking, or verify `bun install` works in subdirectories.

```bash
# Install all dependencies (Backend + Frontend)
bun install:all

# OR manually:
cd backend && bun install
cd ../frontend && bun install
```
