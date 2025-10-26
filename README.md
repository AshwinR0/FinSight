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
- Ensure the runtime environment provides the same VITE\_ env variables to the deployed site (Vite will replace `import.meta.env` at build-time).

## Google Sign-in with Supabase

This project includes a small `SignIn` component that triggers Supabase's OAuth flow for Google. To enable Google signin end-to-end, follow these steps:

1. Enable Google provider in your Supabase project

   - Open the Supabase dashboard for your project.
   - Go to Settings -> Auth -> Providers.
   - Enable Google and provide the OAuth Client ID and Client Secret from the Google Cloud Console.
   - Set the Redirect URL(s) to your Vite app origin(s), for example:
     - http://localhost:5173
     - https://your-production-domain.com

2. Update your `.env` (if needed) and ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are present.

3. Use the built-in `SignIn` component
   - The component is at `src/components/SignIn.tsx` and uses `supabase.auth.signInWithOAuth({ provider: 'google' })` to start the flow.
   - Example usage (place it on a page or in the header):

```tsx
import SignIn from "@/components/SignIn";

export default function AuthPage() {
  return (
    <div className="p-6">
      <SignIn />
    </div>
  );
}
```

4. Handle the callback

   - Supabase's client-side OAuth will handle redirect and session in the browser if your project is configured correctly.
   - On successful signin the `supabase.auth` client will persist the session to localStorage by default (see `src/integrations/supabase/client.ts`).

5. (Optional) Server-side session handling
   - If you need server-side session verification, use Supabase's server-side libraries or verify the session token with your server using Supabase admin keys. Keep service_role keys strictly server-side.

Security note: the publishable key is safe for client-side usage. Never expose service_role keys in client bundles.

## Contributing

- Open issues or PRs for bugs or improvements.

## License

- Add your project's license here.
