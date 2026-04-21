DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'review'
      AND column_name = 'tourId'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'review'
      AND column_name = 'tour_id'
  ) THEN
    EXECUTE 'ALTER TABLE "review" RENAME COLUMN "tourId" TO "tour_id"';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'review_tourId_fkey'
      AND conrelid = '"review"'::regclass
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'review_tour_id_fkey'
      AND conrelid = '"review"'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE "review" RENAME CONSTRAINT "review_tourId_fkey" TO "review_tour_id_fkey"';
  END IF;
END $$;
