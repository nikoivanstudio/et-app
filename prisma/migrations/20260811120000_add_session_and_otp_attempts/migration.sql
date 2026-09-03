-- HIGH-2: серверное хранилище сессий, чтобы токен можно было отозвать
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP NOT NULL,
    "revoked_at" TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "session_user_id_idx" ON "session"("user_id");
CREATE INDEX "session_expires_at_idx" ON "session"("expires_at");

ALTER TABLE "session"
    ADD CONSTRAINT "session_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "user"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- CRIT-2: счётчик попыток ввода кода подтверждения
ALTER TABLE "otp" ADD COLUMN "attempts" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "otp_email_idx" ON "otp"("email");

-- CRIT-2: старые коды сгенерированы слабым генератором (Math.random, 4 знака).
-- Они не должны продолжать действовать после обновления.
DELETE FROM "otp";
