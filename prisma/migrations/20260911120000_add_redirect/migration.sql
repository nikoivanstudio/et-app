-- B5. Механизм редиректов.
--
-- Склейка дублей (B6), разведение каталогов (B7) и переименование слагов
-- с HTML-сущностями (B8) — это порядка девятисот переадресаций. Держать их
-- в коде нельзя: каждая правка требовала бы деплоя, а список правится
-- по мере разбора справочника.

CREATE TABLE "redirect" (
    "id" SERIAL NOT NULL,
    "source" VARCHAR(512) NOT NULL,
    "destination" VARCHAR(512) NOT NULL,
    "status_code" INTEGER NOT NULL DEFAULT 301,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "note" VARCHAR(512),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "redirect_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "redirect_source_key" ON "redirect"("source");

CREATE INDEX "redirect_is_active_idx" ON "redirect"("is_active");
