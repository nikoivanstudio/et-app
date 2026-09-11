-- A3. Поля тура, без которых не собрать ни карточку, ни разметку.
--
-- В модели уже были цена, длительность, маршрут, точка старта и рейтинг.
-- Не хватало того, что спрашивают перед заявкой: что входит и что нет,
-- вместимость машины, сложность, сезонность, за что цена.

ALTER TABLE "tour"
  ADD COLUMN "included"    TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "excluded"    TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "capacity"    INTEGER,
  ADD COLUMN "difficulty"  VARCHAR(20),
  ADD COLUMN "faq"         JSONB,
  ADD COLUMN "seasons"     INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
  ADD COLUMN "price_unit"  VARCHAR(20),
  ADD COLUMN "start_city"  VARCHAR(120);

-- Цена за машину — то, как в Крыму продают джип-тур, и то, что написано
-- на всех легаси-страницах. Проставляем существующим турам явно, чтобы
-- в разметке Offer не оказалось цены без единицы измерения.
UPDATE "tour" SET "price_unit" = 'PER_CAR' WHERE "price_unit" IS NULL;

-- E1. Объект как отдельная сущность.
--
-- Справочник живёт в модели Post вперемешку со статьями, поэтому
-- «Мангуп-Кале» на сайте — статья, а не сущность: к ней нельзя привязать
-- туры и нельзя построить перелинковку иначе как руками.

CREATE TABLE "place" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" VARCHAR(512),
    "content" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "city" VARCHAR(120),
    "district" VARCHAR(120),
    "kind" VARCHAR(80),
    "main_image" VARCHAR(512),
    "post_id" INTEGER,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "place_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "place_slug_key" ON "place"("slug");
CREATE UNIQUE INDEX "place_post_id_key" ON "place"("post_id");
CREATE INDEX "place_city_idx" ON "place"("city");
CREATE INDEX "place_is_published_idx" ON "place"("is_published");

-- Связь «тур ↔ объект» с порядком остановки в маршруте: без него блок
-- «маршрут» на карточке тура строился бы по алфавиту.
CREATE TABLE "tour_place" (
    "tour_id" INTEGER NOT NULL,
    "place_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tour_place_pkey" PRIMARY KEY ("tour_id","place_id")
);

CREATE INDEX "tour_place_place_id_idx" ON "tour_place"("place_id");

ALTER TABLE "tour_place"
  ADD CONSTRAINT "tour_place_tour_id_fkey"
  FOREIGN KEY ("tour_id") REFERENCES "tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tour_place"
  ADD CONSTRAINT "tour_place_place_id_fkey"
  FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
