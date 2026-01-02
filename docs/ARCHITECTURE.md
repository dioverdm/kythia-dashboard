# Architecture & Tech Stack

This document details the architectural decisions, technology stack, and project structure of the **Kythia Dashboard**.

## Technology Stack

### Core
*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
    *   Leverages React Server Components (RSC) for performance.
    *   Uses File-system based routing.
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
    *   Strict type checking enabled for robustness.
*   **Runtime**: [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/)
    *   Compatible with both runtimes.

### Data & Backend
*   **Database**: MySQL
*   **ORM**: [Prisma](https://www.prisma.io/)
    *   Used for schema definition and type-safe database access.
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (v4)
    *   **Provider**: Discord OAuth2.
    *   **Adapter**: Prisma Adapter (stores sessions/users in MySQL).

### UI & Styling
*   **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
    *   Utility-first CSS for rapid styling.
*   **Component Library**: [MUI (Material UI)](https://mui.com/)
    *   Used for pre-built, accessible components (Cards, Grids, Inputs).
    *   Custom theme applied in `src/@core/theme`.
*   **Icons**: [Iconify](https://iconify.design/) & Tabler Icons.

### Tooling
*   **Linting**: ESLint (Next.js config)
*   **Formatting**: [Biome](https://biomejs.dev/)
*   **Package Manager**: npm / pnpm / bun

---

## Project Structure

The codebase is organized by feature and function, adhering to the Next.js App Router conventions.

```
src/
├── @core/                 # Core application logic & UI
│   ├── components/        # Wrapper components (custom Avatar, etc.)
│   ├── theme/             # MUI Theme configuration (Palettes, Shadows, Typography)
│   └── utils/             # Core utilities
├── @layouts/              # Layout definitions
│   ├── components/        # Layout-specific components (Navbar, VerticalNav)
│   └── BlankLayout.tsx    # Simple layout for auth pages
├── @menu/                 # Navigation menu configuration
├── app/                   # Next.js App Router (Routes)
│   ├── (landing)/         # Public marketing pages
│   ├── [lang]/            # Internationalized Root
│   │   ├── (dashboard)/   # Dashboard Application
│   │   │   ├── (private)/ # Protected routes (require valid session)
│   │   │   │   └── dash/  # Main Dashboard views
│   │   │   └── layout.tsx # Root dashboard layout wrapper
│   └── api/               # API Routes
│       ├── auth/          # NextAuth handlers
│       └── v1/            # Backend API consumers or public APIs
├── components/            # Shared React components (Dialogs, Custom Inputs)
├── configs/               # Global configurations (i18n, themeConfig)
├── contexts/              # React Contexts (SettingsProvider, AuthProvider)
├── data/                  # Static data assets
├── libs/                  # Library usage (Axios/Fetch wrappers, NextAuth options)
├── prisma/                # Database schema (schema.prisma)
└── utils/                 # General helper functions (date formatting, string manipulation)
```

## Integrations

### Kythia Bot Integration
The dashboard serves as a control panel for the **Kythia Bot**. It does not duplicate bot logic but interfaces with it via API.

*   **Communication**: HTTP Requests to `KYTHIA_BOT_API_URL`.
*   **Security**: Shared `API_SECRET` in headers validates requests between Dashboard and Bot.
*   **Data Flow**:
    1.  User views a graphical setting (e.g., Welcome Message).
    2.  Dashboard fetches current config from Bot API/Database.
    3.  User updates setting.
    4.  Dashboard sends update payload to Bot API.
    5.  Bot applies change immediately.

### Authentication Flow
1.  User clicks "Login with Discord".
2.  Redirected to Discord OAuth2.
3.  On success, callback to `/api/auth/callback/discord`.
4.  NextAuth creates/updates `User` and `Account` in MySQL.
5.  Session token issued (stored in cookie).
6.  Middleware protects `/dash` routes, verifying session validity.
