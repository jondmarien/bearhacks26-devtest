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
- **Accessibility**: High contrast ratios and clear loading/error feedback.

## ✨ Motion & Interactions

We use **Framer Motion** to create a living, breathing interface that feels responsive and high-end:

- **Centralized Variants**: All major animations (fades, slides, staggered child animations, and floating effects) are defined in `src/styles/animations.ts`. This ensures movement consistency across the entire app.
- **Branded Loading**: Our custom `HoneycombSpinner` and `LoadingScreen` replace generic spinners with a geometric, hexagon-based animation that reinforces the BearHacks brand identity.
- **Hardware Accelerated**: Animations prioritize `transform` and `opacity` properties with `will-change` optimizations to ensure 120FPS smoothness on high-refresh displays.
- **Micro-interactions**: Hover states and layout transitions (using `layoutId`) provide tactile feedback for navigation and tab switching.

## 📄 Pages (Controllers)

-   **Landing (`/`)**: High-impact hero section with primary Call-to-Action.
-   **Application (`/app/apply`)**: Fragmented form orchestrator with auto-save capabilities.
-   **RSVP (`/app/rsvp`)**: Centered, ticket-style status confirmation.
-   **Admin Dashboard (`/admin/dashboard`)**: Tabbed management interface with deep-link modals.

## 🤝 Shared Schemas & Validation

This project leverages a centralized validation layer to ensure consistency:
-   **Shared Source**: Form validation schemas are located in the root `/shared` directory.
-   **Zod + Hook Form**: We use `zodResolver` to bind shared schemas to React forms, ensuring that any field update in `/shared` automatically synchronizes the entire stack.
-   **Type Safety**: TypeScript types for applications and RSVPs are inferred directly from these shared Zod schemas.

## 🔐 Session & Security

-   **Admin Persistence**: 30-minute rolling window for secure organizer sessions.
-   **Auto-Redirects**: Intelligent navigation logic based on session validity.
-   **Validation**: Real-time enforcement using the shared Zod contracts.
