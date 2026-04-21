### Database & API Rules

- Prefer server components for initial data fetch when SEO, performance, or SSR benefits apply.
- Use client components and client-side fetching when interactivity, browser-only APIs, or live client state require it.
- Paginate all lists — default 20 items per page.
- Always select only needed columns, never use `select('*')` in production.
- Use Supabase realtime only for chat/messages (not for listings).
- Create Supabase views for complex joins:
  - `listings_with_details` — listing + location + user + cover image;
  - `conversations_with_preview` — conversation + last message + listing;
  - `users_with_stats` — user + listing count + average rating.
  
### Naming Conventions in Database Queries
- Filter publicly visible active listings: always add `.eq('status', 'active')`.
- Filter non-expired listings: always add `.gte('expires_at', new Date().toISOString())`.
- Filter expired listings: always add `.lt('expires_at', new Date().toISOString())`.
- Order listings: default by `is_premium desc, created_at desc`.