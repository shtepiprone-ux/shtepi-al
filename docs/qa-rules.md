## QA Rules

### TypeScript Strict Mode
- `strict: true` must be enabled in `tsconfig.json` (Next.js default).
- Never use `any` type — use `unknown` and narrow it.
- Never use non-null assertion `!` without a comment explaining why.
- Always handle null/undefined cases explicitly.

### Runtime Validation with Zod
- Define Zod schemas in each module's `validations/index.ts`.
- Every form must have a corresponding Zod schema.
- Validate Supabase responses for critical data.
- Schemas needed:
  - `loginSchema` — email + password.
  - `registerSchema` — name, email, password, phone, user_type, company_name.
  - `listingSchema` — all listing fields with proper constraints.
  - `profileSchema` — name, phone, whatsapp, avatar_url.

### Race Condition Prevention
- Debounce search inputs (300ms minimum).
- Disable submit buttons immediately on click, re-enable only on error.
- For favorites/actions: optimistic update + rollback on error.

### Stale Data Prevention
- After mutation always refetch affected data.
- Use `router.refresh()` after server-side data changes.
- Add `revalidatePath()` in server actions after mutations.

### Form & Input Safety
- Trim all text inputs before saving to database.
- Max length limits:
  - title: 150 chars;
  - description: 5000 chars;
  - name: 100 chars;
  - company_name: 200 chars;
- Reject files over 10MB in image upload.
- Accept only: `jpg`, `jpeg`, `png`, `webp` for images.
- Sanitize HTML in any rich text content before display.

### Timezone Safety
- Always store dates in UTC (Supabase default).
- Always display dates in user's local timezone.
- Use `date-fns` or `Intl.DateTimeFormat` for date formatting.
- Never use `new Date()` directly for display — always format it.

### Image Upload Safety
- Validate file type on client AND server side.
- Show upload progress indicator.
- Handle Cloudinary errors gracefully with retry option.
- Optimize images before upload; target compressed files at or below 2MB when possible.
- Generate thumbnail automatically via Cloudinary transformations.
- If upload fails — do not save listing, show clear error.

### Error Monitoring (Sentry)
- Sentry is installed and configured.
- Capture unhandled promise rejections.
- Capture Supabase query errors in catch blocks.
- Never log sensitive data (passwords, tokens) to Sentry.
- Set up alerts for new error types in Sentry dashboard.

### Before Every Commit
- Run `npm run build` locally to catch build errors before pushing.
- Check browser console for errors and warnings.
- Test the changed component in at least 3 screen sizes (mobile/tablet/desktop).
- Verify all 4 language versions display correctly.
- Check that no text is hardcoded (all must use i18n).

### Error Handling
- Every Supabase query must have error handling.
- Never expose raw error messages to users — show friendly localized messages.
- Add error boundaries for critical sections.
- Log errors to console in development, suppress in production.
- Network errors must show retry option where possible.
- 404 page: custom, with search bar and popular listings.
- 500 page: custom, with contact support link.

### Data Validation
- Enforce domain-specific validation rules on both client and server.
- Price must always be a positive number.
- Phone numbers must match Albanian format (`+355`).
- Email fields must always be validated.
- Slugs must be URL-safe (no special characters; spaces replaced with hyphens).
- Sanitize user-generated content before display.

### Testing Checklist (manual, before each deploy)
Critical paths to test:
- [ ] Register as private user;
- [ ] Register as agent (with and without company name);
- [ ] Login with email/password;
- [ ] Login with Google OAuth;
- [ ] Logout;
- [ ] Create listing with photos;
- [ ] Edit listing;
- [ ] Delete listing (with confirmation);
- [ ] Search listings with filters;
- [ ] Search persists in URL;
- [ ] Add to favorites / remove from favorites;
- [ ] Send message to listing owner;
- [ ] Open conversation, reply;
- [ ] Change language (all 4) — verify all text changes;
- [ ] View on mobile (375px) — no horizontal scroll;
- [ ] View on tablet (768px);
- [ ] View on desktop (1280px);
- [ ] Listing detail page: photo gallery lightbox;
- [ ] Listing detail page: map loads;
- [ ] Admin: change listing status;
- [ ] Admin: verify agent;
- [ ] Admin: edit static page;
- [ ] Moderator: cannot create admin user.