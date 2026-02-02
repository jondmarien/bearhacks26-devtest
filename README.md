# BearHacks 2026 PoC

This repository contains the Proof of Concept (PoC) for the BearHacks 2026 application system. It is structured as a monorepo containing a separate Frontend (Vite + React) and Backend (Express + Bun).

## 🏗️ Structure

- **`frontend/`**: React application using Vite, TypeScript, and TailwindCSS.
- **`backend/`**: Express API using Bun, Mongoose (MongoDB), and JWT Authentication.

## 🚀 Quick Start

To run both the frontend and backend concurrently (requires Bun):

```bash
# Install dependencies for both
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
- **Admin Panel**: Dashboard for organizers to review and accept applications.
    - **Login**: `/admin`
    - **Default User**: `admin`
    - **Default Pass**: `bearhacks2026@admin`
- **Logging**: Comprehensive logging for all requests and critical actions.

## 🛠️ Technology Stack

- **Runtime**: Bun (Fast JavaScript runtime)
- **Frontend**: React, Vite, TailwindCSS v4
- **Backend**: Express.js, MongoDB Atlas (Mongoose)
- **Security**: `bcryptjs`, `jsonwebtoken`, `cors` (SameSite=None)
