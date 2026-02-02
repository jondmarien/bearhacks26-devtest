# 🐻 BearHacks 2026 - Frontend

The premium, modular frontend for BearHacks 2026. Built with React, Vite, and TailwindCSS v4.

## ⚙️ Development Setup

1.  **Install Dependencies** (from root recommended)
    ```bash
    bun run install:all
    ```
2.  **Environment Variables**
    Create `.env` in this directory:
    ```env
    VITE_API_BASE_URL=http://localhost:5000
    ```
3.  **Launch**
    ```bash
    bun run dev
    ```

## 🧩 Modular Component Architecture

The frontend is organized into logical component domains to ensure lean pages and reusable logic:

-   **`src/components/admin/`**: Dashboard components, application tables, and review modals.
-   **`src/components/application/`**: Modular form sections (`BasicInfo`, `Skills`, `Accessibility`), error modals, and admin-only test lists.
-   **`src/components/rsvp/`**: Interactive RSVP status cards and admin app selectors.
-   **`src/components/layout/`**: Shared UI elements like `Navbar` and the `GlowBackground` system.

## 🎨 Design System: "BearHacks Premium"

We follow a high-contrast, dark-mode aesthetic designed to wow users:
-   **Aesthetic**: Neon gradients (Purple/Blue/Pink), glassmorphism, and subtle micro-animations.
-   **Glow System**: Centralized `GlowBackground` component for consistent, themed page backgrounds.
-   **Accessibility**: High contrast ratios and clear loading/error feedback.

## 📄 Pages (Controllers)

-   **Landing (`/`)**: High-impact hero section with primary Call-to-Action.
-   **Application (`/app/apply`)**: Fragmented form orchestrator with auto-save capabilities.
-   **RSVP (`/app/rsvp`)**: Centered, ticket-style status confirmation.
-   **Admin Dashboard (`/admin/dashboard`)**: Tabbed management interface with deep-link modals.

## 🔐 Session & Security

-   **Admin Persistence**: 30-minute rolling window for secure organizer sessions.
-   **Auto-Redirects**: Intelligent navigation logic based on session validity.
-   **Validation**: Real-time schema enforcement using Zod and React Hook Form.
