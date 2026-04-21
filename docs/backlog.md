# Project Status & Immediate Tasks

## Implemented Features & Current State

- [x] Next.js 16 initialized.
- [x] shadcn/ui installed (27 components).
- [x] Supabase connected.
- [x] All 25 DB tables created with RLS policies.
- [x] TypeScript types for all tables.
- [x] i18n setup (sq/en/uk/it) with next-intl.
- [x] Auth pages (login + register with Google OAuth).
- [x] Sentry error monitoring configured.
- [x] Zod + react-hook-form + date-fns installed.
- [x] Modular monolith folder structure (src/modules/).
- [x] CLAUDE.md with full project context.
- [x] Zod validation schemas (loginSchema, registerSchema — `src/modules/auth/validations/index.ts`).
- [x] Header component (`src/components/layout/Header.tsx`) — sticky, language switcher, auth state, mobile Sheet.
- [x] Footer component (`src/components/layout/Footer.tsx`) — fully i18n, all 4 languages.
- [x] `src/app/[locale]/layout.tsx` — Header + Footer wired in.
- [x] Homepage (`src/app/[locale]/page.tsx`) — Hero + HeroSearch, Stats, Featured, Latest, PopularLocations, How it works, Agent CTA.
- [x] HeroSearch (`src/components/shared/HeroSearch.tsx`) — listing type, property type, location combobox, advanced filters.
- [x] FiltersPanel (`src/components/shared/FiltersPanel.tsx`) — slide-in side panel with all filters.
- [x] Listing detail page (`src/app/[locale]/listings/[slug]/page.tsx`).
- [x] ListingGallery (`src/modules/listings/components/ListingGallery.tsx`) — grid + lightbox.
- [x] ListingContact (`src/modules/listings/components/ListingContact.tsx`) — sticky sidebar + mobile bottom bar.
- [x] SimilarListings (`src/modules/listings/components/SimilarListings.tsx`).
- [x] MapWrapper + Map (`src/components/shared/MapWrapper.tsx`) — Leaflet dynamic import.
- [x] Supabase user creation trigger fixed (correct enum names: user_role, user_type).
- [x] Locations seeded (238 locations — 36 regions, 45 cities, 157 villages).
- [x] Test listings seeded (5 listings).
- [x] Design system — globals.css with full oklch token system, brand shade scale --brand-50 → --brand-950 based on #EC5447.
- [x] Listings page (`/listings`) — filters sidebar + grid + pagination + sort.
- [ ] User profile / cabinet page.
- [ ] Admin panel.
- [ ] Cloudinary integration (`npm install next-cloudinary`).
- [ ] Currency rate fetcher (iliria98.com → Supabase Edge Function).
- [ ] Resend email integration (`npm install resend`).
- [ ] Google OAuth enable in Supabase Dashboard.
- [ ] Tiptap editor for admin static pages.

## Last Session Summary
Continued from previous session. Built listings page, fixed color system, fixed hardcoded styles.

**Listings page** — `src/app/[locale]/listings/page.tsx` (server component):
- Reads all URL searchParams: type, property_type, location_id, price_min/max, area_min/max, rooms, condition, heating, sort, page;
- Server-side Supabase query with full filter + sort + pagination;
- Sort options: newest (default), price_asc, price_desc, area_desc;
- `src/modules/listings/components/ListingsFilters.tsx` — sticky desktop sidebar, mobile sheet;
- `src/modules/listings/components/ListingsSortBar.tsx` — result count, sort select, grid/list toggle, mobile filter button with active count badge;
- `src/modules/listings/components/ListingsPagination.tsx` — smart pagination with ellipsis;
- `src/modules/listings/components/ListingsShell.tsx` — client shell managing view state + mobile sheet;
- All filter changes update URL params (shareable/bookmarkable).
- All new keys added to all 4 language files (sq/en/uk/it).

## Next Immediate Tasks (in order)

### 1. User cabinet (`/cabinet`)
- Profile page: avatar, name, phone, WhatsApp, user type.
- My listings tab: list with status badges, edit/delete actions.
- Saved searches tab.
- Route: `src/app/[locale]/cabinet/page.tsx`.
- Requires auth guard (redirect to /auth/login if not logged in).

### 2. Cloudinary integration
- `npm install next-cloudinary`.
- Add env vars: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Create upload component: `src/modules/listings/components/ImageUpload.tsx`.
- Use `CldUploadWidget` from next-cloudinary.

### 3. Create listing form (`/listings/create`)
- Multi-step form: basic info → details → photos → location → preview.
- Uses listingSchema (Zod) from `src/modules/listings/validations/index.ts`.
- Requires auth + must be agent or admin.

### 4. Admin panel (`/admin`)
- No locale prefix.
- Sidebar: Dashboard, Listings, Users, Support, Pages.
- Listings table: status management, premium toggle.
- Users table: role management, verify agent.
- Route guard: admin/moderator only.

### 5. Google OAuth
Supabase Dashboard → Authentication → Providers → Google → Enable.