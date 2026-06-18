ALTER TABLE "Settings" ALTER COLUMN "maxHoursPerWeek" SET DEFAULT 6.0;
ALTER TABLE "Settings" ALTER COLUMN "maxHoursPerDay" SET DEFAULT 3.0;

UPDATE "Settings"
SET "maxHoursPerWeek" = 6.0
WHERE "maxHoursPerWeek" = 8.0;

UPDATE "Settings"
SET "maxHoursPerDay" = 3.0
WHERE "maxHoursPerDay" = 4.0;
