-- Tour moderation: a guide submits a tour for review (status = 'PENDING').
-- An admin/super admin approves it (status = 'APPROVED' — publicly visible) or
-- rejects it (status = 'REJECTED' + rejection_comment).
-- IF NOT EXISTS / guarded UPDATE keep this safe to run regardless of the current state.

-- AddColumn: rejection comment shown to the guide when a tour is rejected.
ALTER TABLE "tour" ADD COLUMN IF NOT EXISTS "rejection_comment" TEXT;

-- Backfill: every pre-existing tour is considered already published. Legacy values
-- ('new', 'default', NULL) are normalised to the new APPROVED status so nothing
-- disappears from the public catalogue after the status filter is introduced.
UPDATE "tour"
SET "status" = 'APPROVED'
WHERE "status" IS NULL
   OR "status" NOT IN ('PENDING', 'APPROVED', 'REJECTED');
