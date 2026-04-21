## External Service Accounts
The following external service accounts are already registered and available for integration; project-side configuration may still be required.

| Service | URL | Purpose |
|---|---|---|
| Supabase | https://supabase.com | Database + Auth |
| Cloudflare | https://dash.cloudflare.com | Hosting + CDN + DNS |
| Cloudinary | https://cloudinary.com | Photo storage + transformations |
| Resend | https://resend.com | Transactional emails |
| Sentry | https://sentry.io | Error monitoring |
| GitHub | https://github.com | Code repository |

### Cloudinary Setup
- Account is registered at https://cloudinary.com.
- Use Cloudinary for ALL property photo uploads — never Supabase Storage.
- Auto-transformations to set up in Cloudinary:
  - Thumbnail: `w_400,h_300,c_fill,f_webp,q_auto`;
  - Card image: `w_800,h_600,c_fill,f_webp,q_auto`;
  - Full size: `w_1920,f_webp,q_auto`.
- Environment variables needed:
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — from Cloudinary dashboard;
  - `CLOUDINARY_API_KEY` — from Cloudinary dashboard (server-only);
  - `CLOUDINARY_API_SECRET` — from Cloudinary dashboard (server-only, never expose to client).
  
### Resend Setup
- Account is registered at https://resend.com .
- Check the current Resend plan limits in the Resend dashboard before relying on quota assumptions.
- Install: `npm install resend`.
- Environment variable needed: `RESEND_API_KEY` — from Resend dashboard (server-only).
- Use Resend for:
  - Email confirmation on registration;
  - Password reset emails;
  - New message notifications;
  - Saved search match notifications;
  - Support ticket replies;
  - Listing expiry warnings.
- Create email templates in `src/modules/notifications/lib/emails/`.
- NEVER call Resend from client-side code — only from server actions or API routes.