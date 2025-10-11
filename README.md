# FinSight

FinSight is a lightweight personal finance / lending UI built with Vite + React + TypeScript and the shadcn/ui design primitives. It provides expense tracking, lending management, and borrower detail views, and uses Supabase as the backend for data storage and auth.

This repo is the app you run locally during development and deploy to static hosting when ready.

## Features
- Expense tracking
- Lending / borrower detail pages
- Responsive layout with a desktop sidebar and mobile bottom navigation
- Supabase integration for persistence and auth
- TailwindCSS + design tokens (HSL variables and gradients)

## Quick start (development)
1. Install dependencies

```bash
npm install
# or, if you previously had dependency conflicts and want to bypass peer-deps checks:
# npm install --legacy-peer-deps
```

2. Create a `.env` file in the project root (see required env values below)

3. Start the dev server

```bash
npm run dev
```

Open http://localhost:5173 (Vite default) in your browser.

## Build for production

```bash
npm run build
npm run preview
```

## Required environment variables
This app reads environment variables through Vite's `import.meta.env` interface. Create a `.env` file in the project root with the following keys:

- VITE_SUPABASE_URL
  - Your Supabase project URL (example: https://xyzcompany.supabase.co)
- VITE_SUPABASE_PUBLISHABLE_KEY
  - The Supabase anon/public key used by the client SDK. This is safe to include in client-side apps (it's the publishable key).

Example `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIU...
```

Notes:
- Do NOT commit your `.env` containing secrets to source control.
- If you later use server-only keys (service_role), keep them in server environment or Supabase functions only.

## Troubleshooting
- npm ERESOLVE peer dependency conflicts (example: react-day-picker vs date-fns)
  - If you see an error like `ERESOLVE could not resolve peer dependency` for `react-day-picker` and `date-fns`, there are three safe approaches:
    1. Downgrade `date-fns` to a version compatible with `react-day-picker` (e.g. `npm install date-fns@^3.6.0`).
    2. Upgrade `react-day-picker` to a release that supports `date-fns@4` (if available) and adjust any breaking changes.
    3. Use a permissive install for development only: `npm install --legacy-peer-deps`.

- Tailwind CSS "Unknown at rule @tailwind" or "Unknown at rule @apply" warnings in some editors/lints
  - These warnings are from linters that don't understand Tailwind's PostCSS directives. If your build works and Tailwind is configured, you can safely ignore them or configure your linter to support Tailwind.

## Where to look in the code
- `src/components` — UI components and shadcn primitives
- `src/pages` — Route pages (Expenses, Lending, BorrowerDetail, Settings)
- `src/integrations/supabase` — `client.ts` and generated `types.ts` for the DB
- `src/index.css` — design tokens, CSS variables and small utilities

## Development tips
- The design system in `src/index.css` uses HSL variables for colors and gradients. If you want to create gradient text that works across browsers, make sure to combine:
  - `bg-clip-text text-transparent` AND the `-webkit-text-fill-color: transparent` helper (a small utility is included).
- Use `npm run lint` to run ESLint.

## Deploying
- Build static assets with `npm run build` and deploy the `dist` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.).
- Ensure the runtime environment provides the same VITE_ env variables to the deployed site (Vite will replace `import.meta.env` at build-time).

## Contributing
- Open issues or PRs for bugs or improvements.

## License
- Add your project's license here.
