# Copilot Instructions for AI Coding Agents

## Project Overview
- **Monorepo**: Contains a Next.js frontend (`next-frontend-web`) and a Node.js/Express backend (`web-api-backend`).
- **Frontend**: Uses Next.js App Router, TypeScript, Tailwind CSS, and Zod for validation. Auth flows and dashboards are under `app/(auth)/` and `app/auth/`.
- **Backend**: REST API with Express, TypeScript, Mongoose, and Zod. Config in `web-api-backend/src/config/`.

## Key Patterns & Conventions
- **Component Structure**: Auth and dashboard components are in `app/(auth)/_components/`. Use Zod schemas for form validation.
- **Routing**: Next.js App Router structure. Use folders for route grouping (e.g., `(auth)`, `(dashboard)`).
- **Styling**: Tailwind CSS via PostCSS. Custom fonts via `next/font`.
- **State/Navigation**: Use Next.js `useRouter` for navigation. Session state (e.g., splash screen) may use `sessionStorage`.
- **API Integration**: Frontend API calls are organized in `lib/actions/` and `lib/api/`.
- **User Types**: Many flows distinguish between `influencer` and `brand` users.

## Developer Workflows
- **Start Frontend**: `npm run dev` in `next-frontend-web` (default port 3000).
- **Start Backend**: `npm run dev` in `web-api-backend` (default port 5050, see `.env`).
- **Linting**: `eslint.config.mjs` uses Next.js and TypeScript rules. Run `npx eslint .`.
- **Validation**: Use Zod for all form and API input validation.
- **Branching**: For feature work, create a branch (e.g., `auth-design` or `sprint-1`). Make small, logical commits (see `SPRINT-1.md`).

## Integration & Data Flow
- **Frontend/Backend**: Frontend calls backend REST endpoints (see `lib/api/`).
- **Backend**: Uses Mongoose for MongoDB. Configurable via environment variables in `.env`.
- **No direct DB access from frontend**.

## Examples
- **Form Validation**: See `app/(auth)/_components/RegisterForm.tsx` and `CollabAuth.tsx` for Zod usage.
- **API Actions**: See `lib/actions/` and `lib/api/` for API call patterns.
- **Dashboard**: See `app/auth/dashboard/page.tsx` for dashboard UI and user type handling.

## Special Notes
- **Do not bypass Zod validation** for forms or API inputs.
- **Keep language: English** (see `SPRINT-1.md`).
- **Deploy**: Use Vercel for frontend (see `README.md`).

---
For more, see `README.md` and `SPRINT-1.md`.
