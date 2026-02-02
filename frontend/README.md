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
-   **Admin Dashboard (`/admin/dashboard`)**: Manage applications.

## 🎨 UI/UX Features

-   **Deep Navigation**: Persistent Navbar on inner pages.
-   **Responsive Design**: Mobile-first layout using TailwindCSS.
-   **Feedback**: Loading states and conditional rendering (e.g., "Under Review" vs "Accepted").
-   **Auth Integration**: Handles HTTP-Only cookies calling the backend.
