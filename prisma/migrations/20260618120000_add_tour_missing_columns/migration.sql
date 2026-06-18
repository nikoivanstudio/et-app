-- Reconcile `tour` table with Prisma schema.
-- These columns exist in the Prisma schema (prisma/models/tour.prisma) but were
-- never added to the database via a migration (they were applied locally via
-- `prisma db push`), so production is missing them. IF NOT EXISTS keeps this safe
-- to run regardless of the current database state.

-- AlterTable
ALTER TABLE "tour" ADD COLUMN IF NOT EXISTS "tags" TEXT[];
ALTER TABLE "tour" ADD COLUMN IF NOT EXISTS "tour_route" JSONB[];
ALTER TABLE "tour" ADD COLUMN IF NOT EXISTS "about" VARCHAR(512);
