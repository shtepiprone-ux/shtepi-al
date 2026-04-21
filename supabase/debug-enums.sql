-- Check actual enum type names in the database
SELECT typname, enumlabel
FROM pg_type
JOIN pg_enum ON pg_type.oid = pg_enum.enumtypid
ORDER BY typname, enumsortorder;
