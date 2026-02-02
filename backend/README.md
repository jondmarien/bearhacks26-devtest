# 🐻 BearHacks 2026 - Backend

The robust backend API for BearHacks 2026, built with Express and Bun.

## ⚙️ Development Setup

1.  **Install Dependencies** (from root recommended)
    ```bash
    bun run install:all
    ```
2.  **Environment Variables**
    Create `.env` in this directory:
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
3.  **Launch**
    ```bash
    bun run dev
    ```

## 📝 Logging Subsystem

The backend implements a centralized `Logger` class for production observability:
-   **Traceability**: Real-time logging of Method/URL/IP for every request.
-   **Identity Correlation**: Logs Discord identity for hacker actions and administrative identity for dashboard actions.
-   **Security Audits**: Automated logs for JWT issuance, session expiry events, and failed authentication attempts.

## 🤝 Shared Schemas & Validation

We use **Zod** to enforce data contracts between the frontend and backend:
-   **Shared Source**: Core schemas are located in the root `/shared` directory.
-   **Type Safe**: API endpoints use Zod validation middleware to ensure data integrity before reaching the business logic.
-   **Parity**: Ensuring exactly the same validation rules apply to client-side forms and server-side APIs.

## 📡 API Architecture

### Authentication (`/auth`)
-   `GET /auth/discord`: Initiate Discord OAuth flow.
-   `GET /auth/discord/callback`: OAuth callback (Cookies + Redirect).
-   `POST /auth/login`: Admin password login.
-   `GET /auth/logout`: Clear session.
-   `GET /auth/me`: Check current session.

### Application (`/api/application`)
-   `GET /me`: Get current user's application.
-   `POST /me`: Create or Update application (Validated by Zod).

### RSVP (`/api/rsvp`)
-   `GET /me`: Get RSVP status (hasApplication, accepted, rsvpd).
-   `POST /`: Confirm RSVP (only if accepted).

### Admin (`/api/admin`) - *Protected*
-   `GET /applications`: List all hacker applications.
-   `GET /my-apps`: List test applications created by the admin.
-   `POST /application/:id/status`: Update hacker application status.
-   `POST /test-application/:id/status`: Update test application status.
-   `GET /logs`: (Internal) Retrieve system logs.
