-- Sample listings for development/testing
-- Requires: locations already imported, a user with admin role exists
-- Replace USER_ID with a real user UUID from your auth.users table

-- First: create a test user manually in Supabase Auth dashboard
-- then replace 'YOUR_USER_UUID' with the actual UUID

DO $$
DECLARE
  tirana_id INT;
  durres_id INT;
  vlore_id INT;
  test_user_id UUID;
BEGIN
  -- Get location IDs
  SELECT id INTO tirana_id FROM locations WHERE slug = 'tirane' LIMIT 1;
  SELECT id INTO durres_id FROM locations WHERE slug = 'durres' LIMIT 1;
  SELECT id INTO vlore_id FROM locations WHERE slug = 'vlore' LIMIT 1;

  -- Get first admin user
  SELECT id INTO test_user_id FROM users WHERE role = 'admin' LIMIT 1;

  IF test_user_id IS NULL THEN
    RAISE NOTICE 'No admin user found. Please create a user first.';
    RETURN;
  END IF;

  -- Listing 1: Premium apartment in Tirana
  INSERT INTO listings (
    user_id, location_id, slug, title, description,
    price, currency, listing_type, property_type, condition,
    rooms, bedrooms, bathrooms, area_gross, area_net, floor, total_floors,
    year_built, is_premium, status, expires_at
  ) VALUES (
    test_user_id, tirana_id,
    'apartament-2-dhoma-tirane-blloku',
    'Apartament 2+1 në Bllok, Tiranë',
    'Apartament modern me pamje të mrekullueshme në zemër të Bllokut. Kati 8, ndërtim i ri, mobiluar plotësisht. Afër të gjitha shërbimeve.',
    150000, 'EUR', 'sale', 'apartment', 'new_build',
    3, 2, 1, 95, 85, 8, 12,
    2022, true, 'active', NOW() + INTERVAL '60 days'
  );

  -- Listing 2: House for rent in Durrës
  INSERT INTO listings (
    user_id, location_id, slug, title, description,
    price, currency, listing_type, property_type, condition,
    rooms, bedrooms, bathrooms, area_gross, area_net, floor, total_floors,
    year_built, is_premium, status, expires_at
  ) VALUES (
    test_user_id, durres_id,
    'shtepi-me-qira-durres-200m-nga-deti',
    'Shtëpi me qira 200m nga deti, Durrës',
    'Shtëpi e bukur 2-katëshe me oborr dhe parking, 200 metër nga deti. Ideale për familje ose pushime.',
    800, 'EUR', 'rent', 'house', 'good',
    5, 3, 2, 180, 160, 1, 2,
    2015, false, 'active', NOW() + INTERVAL '60 days'
  );

  -- Listing 3: Studio apartment in Tirana
  INSERT INTO listings (
    user_id, location_id, slug, title, description,
    price, currency, listing_type, property_type, condition,
    rooms, bedrooms, bathrooms, area_gross, area_net, floor, total_floors,
    year_built, is_premium, status, expires_at
  ) VALUES (
    test_user_id, tirana_id,
    'studio-me-qira-tirane-qender',
    'Studio me qira, Qendër Tiranë',
    'Studio e re, e mobiluar, në qendër të Tiranës. Transport publik 2 minuta. Ideale për studentë ose profesionistë.',
    450, 'EUR', 'rent', 'apartment', 'new_build',
    1, 1, 1, 45, 40, 4, 10,
    2023, false, 'active', NOW() + INTERVAL '60 days'
  );

  -- Listing 4: Villa for sale in Vlorë
  INSERT INTO listings (
    user_id, location_id, slug, title, description,
    price, currency, listing_type, property_type, condition,
    rooms, bedrooms, bathrooms, area_gross, area_net, floor, total_floors,
    year_built, is_premium, status, expires_at, price_old
  ) VALUES (
    test_user_id, vlore_id,
    'vile-shitje-vlore-prane-detit',
    'Vilë luksoze me pishinë, Vlorë',
    'Vilë fantastike me pishinë private dhe pamje drejtpërdrejt nga deti Jon. 500m² truall, 300m² sipërfaqe. Mundësi investimi.',
    380000, 'EUR', 'sale', 'house', 'good',
    7, 4, 3, 300, 270, 1, 2,
    2018, true, 'active', NOW() + INTERVAL '60 days',
    420000
  );

  -- Listing 5: Land for sale in Durrës
  INSERT INTO listings (
    user_id, location_id, slug, title, description,
    price, currency, listing_type, property_type, condition,
    area_gross, is_premium, status, expires_at
  ) VALUES (
    test_user_id, durres_id,
    'toke-shitje-durres-rruga-kryesore',
    'Tokë ndërtimi 500m² pranë rrugës kryesore, Durrës',
    'Tokë me leje ndërtimi, 500m², 50m nga rruga kryesore Tiranë-Durrës. Ideale për pallat ose objekt tregtar.',
    120000, 'EUR', 'sale', 'land', null,
    500, false, 'active', NOW() + INTERVAL '60 days'
  );

  RAISE NOTICE 'Sample listings inserted successfully.';
END $$;
