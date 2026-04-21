ALTER TABLE "review" RENAME COLUMN "tourId" TO "tour_id";

ALTER TABLE "review" RENAME CONSTRAINT "review_tourId_fkey" TO "review_tour_id_fkey";

ALTER TABLE "review" RENAME CONSTRAINT "review_tourId_not_null" TO "review_tour_id_not_null";
