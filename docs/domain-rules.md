## Listing Features
- Badges: New (`created_at > now() - interval '7 days'`), Premium (`is_premium = true`), Price reduced (`price_old IS NOT NULL AND price < price_old`), Archived (`status IN ('sold', 'rented', 'archived')`).
- Price: always show the current price; if `price_old IS NOT NULL` and `price < price_old`, also show the old price as struck through; display prices in ALL and EUR.
- Currency: ALL (default) and EUR; exchange rate is fetched from iliria98.com daily.
- Full text search via Postgres tsvector (GIN index).
- Unique views tracking via ip_hash (privacy-safe).
- Amenities system via listing_amenities junction table.
- Listing expires after 60 days (extendable by moderator/admin).
- Slug-based URLs for SEO.