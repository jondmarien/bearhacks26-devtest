# BearHacks 2026 - Frontend

The frontend user interface for BearHacks 2026, built with React, Vite, and TailwindCSS.

## ⚙️ Setup

1.  **Install Dependencies**
    ```bash
    bun install
    ```

2.  **Environment Variables**
    Create a `.env` file in this directory:
    ```env
    VITE_API_BASE_URL=http://localhost:5000
    ```

3.  **Run Development Server**
    ```bash
    bun run dev
    ```

## 📄 Pages

-   **Landing (`/`)**: Main entry point. Login button.
-   **Application (`/app/apply`)**: Hacker application form. Auto-saves.
-   **RSVP (`/app/rsvp`)**: Status check and confirmation page.
-   **Admin Login (`/admin`)**: Password-based login for organizers.
-   **Admin Dashboard (`/admin/dashboard`)**: Tabbed interface to manage Hacker Applications and Test Applications separately.
-   **NotFound (`/404`)**: Themed 404 page for broken links.
-   **Error (`/error`)**: Themed error page for system failures.

## 🎨 UI/UX Features

-   **Deep Navigation**: Persistent Navbar on inner pages.
-   **Admin Session Persistence**: 30-minute auto-redirect and secure timeout for organizers.
-   **Responsive Design**: Mobile-first layout using TailwindCSS.
-   **Feedback**: Loading states, custom Logger integration, and conditional rendering (e.g., "Under Review" vs "Accepted").
-   **Auth Integration**: Handles HTTP-Only cookies calling the backend.

## 🤝 Shared Schemas & Forms

The frontend uses **React Hook Form** combined with **Zod** for robust form handling.

-   **Schema Location**: `../../shared/schemas` (aliased as `@shared`).
-   **Form Logic**: `ApplicationPage` uses `useForm` with `zodResolver`.
-   **Validation**: Real-time error messages for required fields and formats.

## 📦 Installation (Monorepo)

To ensure shared dependencies are linked correctly:
```bash
# From root
bun install:all
```
