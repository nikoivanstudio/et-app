-- Partner applications: a user requests to become a GUIDE or SELLER.
-- A super admin reviews each application; on approval the user's role is updated.
-- IF NOT EXISTS keeps this safe to run regardless of the current database state.

-- CreateTable
CREATE TABLE IF NOT EXISTS "partner_application" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" VARCHAR(40) NOT NULL,
    "status" VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "partner_application_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'partner_application_user_id_fkey'
    ) THEN
        ALTER TABLE "partner_application"
            ADD CONSTRAINT "partner_application_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
