-- Add coordinates to existing loads
-- This script adds sample coordinates for common CIS cities

-- Moscow coordinates: 55.7558, 37.6173
-- St. Petersburg: 59.9343, 30.3351
-- Minsk: 53.9006, 27.5590
-- Astana: 51.1694, 71.4491
-- Tashkent: 41.2995, 69.2401
-- Almaty: 43.2220, 76.8512
-- Baku: 40.4093, 49.8671
-- Tbilisi: 41.7151, 44.8271
-- Yerevan: 40.1792, 44.4991

-- Update loads from Moscow
UPDATE loads
SET
  "originLatitude" = 55.7558,
  "originLongitude" = 37.6173
WHERE "originCity" ILIKE '%Moscow%' OR "originCity" ILIKE '%Москва%';

UPDATE loads
SET
  "destinationLatitude" = 55.7558,
  "destinationLongitude" = 37.6173
WHERE "destinationCity" ILIKE '%Moscow%' OR "destinationCity" ILIKE '%Москва%';

-- Update loads from St. Petersburg
UPDATE loads
SET
  "originLatitude" = 59.9343,
  "originLongitude" = 30.3351
WHERE "originCity" ILIKE '%Petersburg%' OR "originCity" ILIKE '%Петербург%';

UPDATE loads
SET
  "destinationLatitude" = 59.9343,
  "destinationLongitude" = 30.3351
WHERE "destinationCity" ILIKE '%Petersburg%' OR "destinationCity" ILIKE '%Петербург%';

-- Update loads from Minsk
UPDATE loads
SET
  "originLatitude" = 53.9006,
  "originLongitude" = 27.5590
WHERE "originCity" ILIKE '%Minsk%' OR "originCity" ILIKE '%Минск%';

UPDATE loads
SET
  "destinationLatitude" = 53.9006,
  "destinationLongitude" = 27.5590
WHERE "destinationCity" ILIKE '%Minsk%' OR "destinationCity" ILIKE '%Минск%';

-- Update loads from Astana
UPDATE loads
SET
  "originLatitude" = 51.1694,
  "originLongitude" = 71.4491
WHERE "originCity" ILIKE '%Astana%' OR "originCity" ILIKE '%Астана%';

UPDATE loads
SET
  "destinationLatitude" = 51.1694,
  "destinationLongitude" = 71.4491
WHERE "destinationCity" ILIKE '%Astana%' OR "destinationCity" ILIKE '%Астана%';

-- Update loads from Tashkent
UPDATE loads
SET
  "originLatitude" = 41.2995,
  "originLongitude" = 69.2401
WHERE "originCity" ILIKE '%Tashkent%' OR "originCity" ILIKE '%Ташкент%';

UPDATE loads
SET
  "destinationLatitude" = 41.2995,
  "destinationLongitude" = 69.2401
WHERE "destinationCity" ILIKE '%Tashkent%' OR "destinationCity" ILIKE '%Ташкент%';

-- Update loads from Almaty
UPDATE loads
SET
  "originLatitude" = 43.2220,
  "originLongitude" = 76.8512
WHERE "originCity" ILIKE '%Almaty%' OR "originCity" ILIKE '%Алматы%';

UPDATE loads
SET
  "destinationLatitude" = 43.2220,
  "destinationLongitude" = 76.8512
WHERE "destinationCity" ILIKE '%Almaty%' OR "destinationCity" ILIKE '%Алматы%';

-- Update loads from Baku
UPDATE loads
SET
  "originLatitude" = 40.4093,
  "originLongitude" = 49.8671
WHERE "originCity" ILIKE '%Baku%' OR "originCity" ILIKE '%Баку%';

UPDATE loads
SET
  "destinationLatitude" = 40.4093,
  "destinationLongitude" = 49.8671
WHERE "destinationCity" ILIKE '%Baku%' OR "destinationCity" ILIKE '%Баку%';

-- Update loads from Tbilisi
UPDATE loads
SET
  "originLatitude" = 41.7151,
  "originLongitude" = 44.8271
WHERE "originCity" ILIKE '%Tbilisi%' OR "originCity" ILIKE '%Тбилиси%';

UPDATE loads
SET
  "destinationLatitude" = 41.7151,
  "destinationLongitude" = 44.8271
WHERE "destinationCity" ILIKE '%Tbilisi%' OR "destinationCity" ILIKE '%Тбилиси%';

-- Update loads from Yerevan
UPDATE loads
SET
  "originLatitude" = 40.1792,
  "originLongitude" = 44.4991
WHERE "originCity" ILIKE '%Yerevan%' OR "originCity" ILIKE '%Ереван%';

UPDATE loads
SET
  "destinationLatitude" = 40.1792,
  "destinationLongitude" = 44.4991
WHERE "destinationCity" ILIKE '%Yerevan%' OR "destinationCity" ILIKE '%Ереван%';

-- Show results
SELECT
  id,
  "originCity",
  "originLatitude",
  "originLongitude",
  "destinationCity",
  "destinationLatitude",
  "destinationLongitude"
FROM loads
WHERE "originLatitude" IS NOT NULL
ORDER BY "createdAt" DESC
LIMIT 10;
