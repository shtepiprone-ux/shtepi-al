# Database & Row Level Security (Supabase)

## User Roles
- `admin` — full access, can create/delete any user including moderators.
- `moderator` — manage listings, users (agent/user only), support tickets, conversations. CANNOT create/delete admins.
- `agent` — real estate agent, can be private person or with company.
- `user` — private person, standard access.

## Security Rules

### Security
- Never expose Supabase service role key in client code.
- Always use RLS policies — never bypass with service role in client.
- Sanitize inputs to prevent XSS.
- Rate limit auth endpoints (Supabase handles this, verify it's enabled).
- Never store sensitive data in localStorage.
- If cookie-based auth, server actions, or custom mutation endpoints are used, ensure CSRF protections are in place; do not assume auth tokens alone are sufficient.
- Content Security Policy headers via Cloudflare.

## Auth & RLS Safety

### Auth & Session Rules
- Always check session expiry before critical actions.
- Handle `AuthSessionMissingError` globally.
- Redirect to login if session expired during user action.
- Show friendly localized message, not raw Supabase auth errors.

### Supabase RLS Checklist
After every new table or policy — verify:
- [ ] Can anonymous users read what they should NOT read?
- [ ] Can user A read/edit user B's private data?
- [ ] Can regular user access admin-only data?
- [ ] Are all insert, update, and delete policies checking `auth.uid()` and role constraints correctly?