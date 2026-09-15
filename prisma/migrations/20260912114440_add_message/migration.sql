-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "author_role" VARCHAR(10) NOT NULL,
    "author_id" INTEGER,
    "text" VARCHAR(2000) NOT NULL,
    "read_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "message_booking_id_created_at_idx" ON "message"("booking_id", "created_at");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
