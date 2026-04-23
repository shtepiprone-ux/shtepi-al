# Shtepi.al

Real estate marketplace for the Albanian market.
Built with Next.js App Router, Supabase, Tailwind CSS, and shadcn/ui.

## Tech Stack
- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- next-intl
- react-hook-form + Zod
- Cloudinary
- Resend
- Sentry
- Leaflet

## Project Documentation
Main project documentation lives in /docs.

- Claude.md - project index and documentation entry point
- docs/ai-behavior.md - workflow, update discipline, commit and deploy behavior
- docs/analytics-rules.md - analytics, SEO, conversion rules
- docs/architecture.md - architecture, module structure, file organization
- docs/backlog.md - progress, session summary, next tasks
- docs/component-rules.md - component development rules
- docs/data-access-rules.md - database and API access rules
- docs/dependencies.md - dependency policy
- docs/domain-rules.md - marketplace and listing rules
- docs/env.md - environment variables
- docs/integrations.md - external services setup
- docs/qa-rules.md - QA and testing checklist
- docs/rls-rules.md - Supabase RLS and auth safety
- docs/ui-rules.md - UI and UX standards

## Getting Started

Install dependencies:
npm install

Create a root .env.local file:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=

Run the app:
npm run dev

Open http://localhost:3000

## Setup Supabase
1. Create a Supabase project.
2. Add SUPABASE URL and anon key to .env.local.
3. Configure auth providers if needed.
4. Ensure RLS policies are enabled.
5. Apply the project schema.
6. Review docs/rls-rules.md before changing auth or DB logic.

## Deployment
Designed for Cloudflare Pages.

Build:
npm run build

Deployment checklist:
- Set all environment variables in Cloudflare Pages.
- Never expose server-only secrets to the client.
- Verify Supabase, Cloudinary, Resend, and Sentry configs.
- Confirm auth redirects and domains.

## Project Structure
src/
  app/
  components/
  modules/
  lib/
  i18n/
  types/
docs/
messages/
Claude.md

## Troubleshooting

Environment variables not working:
- Ensure .env.local exists.
- Restart dev server.
- Use NEXT_PUBLIC_ only for client-safe values.

Supabase auth issues:
- Verify URL and anon key.
- Check redirect URLs and providers.
- Review RLS policies.

Images not uploading:
- Check Cloudinary credentials.
- Verify size and allowed formats.

Emails not sending:
- Verify RESEND_API_KEY.
- Ensure emails send only from server code.

Build fails in production:
- Run npm run build locally.
- Check missing env vars.
- Review server and client boundaries.

## Notes
- Do not hardcode user-visible text. Use i18n.
- Do not hardcode colors. Use semantic tokens.
- Update /docs files when rules change.
- Keep Claude.md as the documentation index only.
