# 🐻 BearHacks 2026

The official hacker application and management system for BearHacks 2026. This project is a production-ready monorepo featuring a premium user experience, robust validation, and modular architecture.

## 🏗️ Architecture & Philosophy

This project follows a **Modular Component Architecture**, designed for maximum maintainability and separation of concerns.

- **`frontend/`**: React application using Vite, TypeScript, and TailwindCSS v4.
    - `src/components/`: Modular, reusable components organized by feature (admin, application, rsvp, layout).
    - `src/pages/`: Slim page controllers that orchestrate modular components.
    - `src/types/`: Centralized TypeScript definitions for reliable data flow.
- **`backend/`**: Express API using Bun, Mongoose (MongoDB), and JWT Authentication.
- **`shared/`**: Common validation logic and Zod schemas used to enforce parity between client and server.

## ✨ Premium Features

- **Branding & Identity**: Custom geometric bear logo and neon-glow aesthetic (Purple/Blue/Pink).
- **Discord Authentication**: Secure OAuth2 login with session synchronization.
- **Modular Application Flow**: Multi-segment form with real-time validation and localized state.
- **RSVP Portal**: Interactive status tracking with custom ticket aesthetics for confirmed hackers.
- **Admin Dashboard**: Advanced review system with tabbed management and detailed review modals.
    - **Test Mode**: Dedicated sandbox for admins to submit and review test entries without cluttering real data.
    - **Session Security**: 30-minute rolling session expiry with automated redirect logic.

## 🛠️ Technology Stack

- **Runtime**: [Bun](https://bun.sh) (High-performance JS runtime)
- **Frontend**: React 19, Vite, TailwindCSS v4, Framer Motion (animations)
- **Backend**: Express.js, MongoDB Atlas (Mongoose)
- **Validation**: Zod (Shared Schemas) + React Hook Form
- **Logging**: Centralized `Logger` subsystem with IP traceability.

## 🚀 Quick Start

To run the entire stack concurrently (requires Bun):

```bash
# Install dependencies for the monorepo
bun install:all

# Launch Backend & Frontend in parallel
bun run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🌐 Deployments

- **Frontend**: [BearHacks 2026](https://bhacks26.chron0.tech)
- **Backend**: [BearHacks 2026 API](https://bearhacks26-devtest.onrender.com)
