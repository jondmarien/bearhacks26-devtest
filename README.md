# BearHacks 2026 PoC

This is the repository for the BearHacks 2026 Hackathon platform. It is a monorepo structure containing a **Vite + React** frontend and a **Node.js (Express)** backend.

## 🏗️ Tech Stack

-   **Frontend:** React, Vite, TypeScript, TailwindCSS v4
-   **Backend:** Node.js (via Bun), Express, Mongoose
-   **Database:** MongoDB Atlas
-   **Authentication:** Discord OAuth2 (HttpOnly Cookies)

## 🚀 Quick Start

Ensure you have [Bun](https://bun.sh/) installed.

1.  **Install Dependencies:**
    ```bash
    bun install
    bun install:all # Installs dependencies for root, frontend, and backend
    ```

    *Note: If `bun install:all` isn't defined yet, simply run `bun install` in root, frontend, and backend folders manually, or rely on `bun install` at root if using workspaces.*

    **Recommended manual install for first run:**
    ```bash
    bun install
    cd frontend && bun install
    cd ../backend && bun install
    cd ..
    ```

2.  **Environment Setup:**
    -   Ensure `backend/.env` is populated with `MONGODB_URI`, `DISCORD_CLIENT_ID`, etc.
    -   Ensure `DISCORD_REDIRECT_URI` is set to `http://localhost:5000/auth/discord/callback` (or your production URL).

3.  **Run Development Server:**
    Run both frontend and backend concurrently:
    ```bash
    bun run dev
    ```

    -   **Frontend:** [http://localhost:5173](http://localhost:5173)
    -   **Backend:** [http://localhost:5000](http://localhost:5000)

## 📂 Structure

-   `frontend/`: Source code for the User Interface.
-   `backend/`: Source code for the API and Database logic.
