### Dependencies
- Before adding a new npm package — check: bundle size, maintenance status, weekly downloads, license, and whether the same problem is already solved by an existing project dependency.
- Prefer packages already in the ecosystem (e.g. use `date-fns` if already installed).
- Never add a package to solve a problem solvable with 10 lines of vanilla JS/TS.
- Preferred existing packages in the project: `zod`, `react-hook-form`, `@hookform/resolvers`, `date-fns`, `@sentry/nextjs`, `next-intl`, `@supabase/supabase-js`, `@supabase/ssr`.