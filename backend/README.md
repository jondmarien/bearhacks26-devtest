# BearHacks 2026 - Backend

The central API for BearHacks 2026, dealing with Authentication, User Data, and Applications.

## 🛠️ Stack

-   **Bun** (Runtime)
-   **Express.js** (Web Framework)
-   **Mongoose** (MongoDB ODM)
-   **JSONWebToken** (Session Management)

## ⚙️ Configuration

Create a `.env` file in this directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/BearHacks26?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173

# Auth Secrets
JWT_SECRET=your_super_secret_key

# Discord OAuth
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_REDIRECT_URI=http://localhost:5000/auth/discord/callback
DISCORD_GUILD_ID=...
DISCORD_BOT_TOKEN=...
```

## 🏃 Run Locally

1.  **Install Dependencies:**
    ```bash
    bun install
    ```

2.  **Start Dev Server:**
    ```bash
    bun run dev
    ```
    Server runs on `http://localhost:5000`.

## 📡 Key Endpoints

-   `GET /auth/discord`: Initiates Discord OAuth login.
-   `GET /auth/me`: Checks current session status.
-   `POST /api/application/me`: Submit/Update user application.
-   `GET /api/rsvp/me`: Get RSVP status.
