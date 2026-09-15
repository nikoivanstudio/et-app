-- AlterTable
ALTER TABLE "review" ADD COLUMN     "guide_reply" VARCHAR(1000),
ADD COLUMN     "guide_reply_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "tour" ADD COLUMN     "blocked_dates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[],
ADD COLUMN     "booking_lead_days" INTEGER,
ADD COLUMN     "meeting_address" VARCHAR(300),
ADD COLUMN     "meeting_note" VARCHAR(1000),
ADD COLUMN     "min_group_size" INTEGER,
ADD COLUMN     "pickup_cities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "price_options" JSONB,
ADD COLUMN     "start_time" VARCHAR(5),
ADD COLUMN     "weekdays" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "city" VARCHAR(120),
ADD COLUMN     "notify_new_booking" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notify_new_message" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notify_news" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notify_trip_reminder" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "vehicle" VARCHAR(200);
