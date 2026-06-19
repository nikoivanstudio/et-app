-- CreateTable
CREATE TABLE "booking" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "guide_id" INTEGER NOT NULL,
    "client_user_id" INTEGER,
    "guest_name" VARCHAR(120) NOT NULL,
    "guest_phone" VARCHAR(40) NOT NULL,
    "guest_email" TEXT,
    "desired_date" TIMESTAMP(3),
    "people_count" INTEGER NOT NULL DEFAULT 1,
    "comment" VARCHAR(1000),
    "status" VARCHAR(40) NOT NULL DEFAULT 'NEW',
    "access_token" TEXT NOT NULL,
    "cancel_reason" VARCHAR(500),
    "guide_note" VARCHAR(1000),
    "status_history" JSONB NOT NULL DEFAULT '[]',
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "processed_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_access_token_key" ON "booking"("access_token");

-- CreateIndex
CREATE INDEX "booking_guide_id_status_idx" ON "booking"("guide_id", "status");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

