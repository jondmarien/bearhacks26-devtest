# BearHacks 2026 - Backend

The backend API for BearHacks 2026, built with Express and Bun.

## ⚙️ Setup

1.  **Install Dependencies**
    ```bash
    bun install
    ```

2.  **Environment Variables**
    Create a `.env` file in this directory:
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://...
    FRONTEND_URL=http://localhost:5173
    
    # Discord OAuth
    DISCORD_CLIENT_ID=...
    DISCORD_CLIENT_SECRET=...
    DISCORD_REDIRECT_URI=http://localhost:5000/auth/discord/callback
    
    # Security
    JWT_SECRET=your_super_secret_key
    NODE_ENV=development
    ```

3.  **Run Development Server**
    ```bash
    bun run dev
    ```

## 🔐 Admin Access

A default admin account is seeded automatically on startup if it doesn't exist.

-   **Username**: `admin`
-   **Password**: `[PASSWORD]`
-   **Endpoint**: `POST /auth/login`

## 📡 API Endpoints

### Authentication (`/auth`)
-   `GET /auth/discord`: Initiate Discord OAuth flow.
-   `GET /auth/discord/callback`: OAuth callback (Cookies + Redirect).
-   `POST /auth/login`: Admin password login.
-   `GET /auth/logout`: clear session.
-   `GET /auth/me`: Check current session.

### Application (`/api/application`)
-   `GET /me`: Get current user's application.
-   `POST /me`: Create or Update application.

### RSVP (`/api/rsvp`)
-   `GET /me`: Get RSVP status (hasApplication, accepted, rsvpd).
-   `POST /`: Confirm RSVP (only if accepted).

### Admin (`/api/admin`) - *Protected*
-   `GET /applications`: List all applications with user info.
-   `POST /application/:id/status`: Update status (`accepted` | `rejected`).

## 📝 Logging

The backend implements comprehensive logging:
-   **Global**: All requests are logged with Method/URL/Timestamp.
-   **Auth**: Success/Failure logs for Discord and Admin login.
-   **App/RSVP**: Logs for application submissions and RSVP confirmations.
-   **Admin**: Logs for fetching lists and updating applicant status.

## 🤝 Shared Schemas & Validation

The backend now uses **Zod** for request validation, sharing schemas with the frontend to ensure consistency.

-   **Schema Location**: `../shared/schemas`
-   **Usage**: Imported via key `@shared/*`.
-   **Middleware**: Validates `POST /application/me` against `ApplicationSchema`.

## 📦 Installation (Monorepo)

To ensure shared dependencies are linked correctly:
```bash
# From root
bun install:all
```
