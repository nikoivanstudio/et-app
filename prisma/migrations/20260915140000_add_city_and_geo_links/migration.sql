-- Справочник городов и ключи вместо строк.
--
-- До этой миграции город был свободной строкой в трёх местах: `tour.start_city`,
-- `place.city`, `user.city`, плюс массив строк `tour.pickup_cities`. Выборка
-- по такой строке сходится ровно до второго гида: «Ялта», «г. Ялта» и «ялта» —
-- три разных города для `where`, и туры молча перестают попадать в подборки.
--
-- Строковые колонки здесь НЕ удаляются. Между `migrate deploy` на сборке и
-- переключением трафика старый код минуту-полторы работает с новой схемой
-- (см. docs/deploy/migrations.md), поэтому удаление идёт отдельной миграцией
-- и отдельным деплоем — задача 1-К в docs/geo/plan.md.

-- AlterTable
ALTER TABLE "place" ADD COLUMN     "city_id" INTEGER;

-- AlterTable
ALTER TABLE "tour" ADD COLUMN     "start_city_id" INTEGER;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "city_id" INTEGER;

-- CreateTable
CREATE TABLE "city" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "region_slug" VARCHAR(60) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_pickup_city" (
    "tour_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,

    CONSTRAINT "tour_pickup_city_pkey" PRIMARY KEY ("tour_id","city_id")
);

-- CreateIndex
CREATE INDEX "city_region_slug_idx" ON "city"("region_slug");

-- CreateIndex
CREATE UNIQUE INDEX "city_slug_key" ON "city"("slug");

-- CreateIndex
CREATE INDEX "tour_pickup_city_city_id_idx" ON "tour_pickup_city"("city_id");

-- CreateIndex
CREATE INDEX "place_city_id_idx" ON "place"("city_id");

-- CreateIndex
CREATE INDEX "tour_start_city_id_idx" ON "tour"("start_city_id");

-- AddForeignKey
ALTER TABLE "tour_pickup_city" ADD CONSTRAINT "tour_pickup_city_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_pickup_city" ADD CONSTRAINT "tour_pickup_city_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place" ADD CONSTRAINT "place_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour" ADD CONSTRAINT "tour_start_city_id_fkey" FOREIGN KEY ("start_city_id") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Города Крыма.
--
-- Координаты не заполняются намеренно: они пойдут в расчёт «что рядом» и
-- в разметку, а выдуманные координаты хуже отсутствующих — то же правило,
-- что у `place`. Порядок (`position`) — не алфавитный: сверху города,
-- из которых выезд заявлен сайтом, дальше остальные.
INSERT INTO "city" ("slug", "title", "region_slug", "position") VALUES
  ('bahchisaray', 'Бахчисарай',  'krym',  10),
  ('sevastopol',  'Севастополь', 'krym',  20),
  ('simferopol',  'Симферополь', 'krym',  30),
  ('yalta',       'Ялта',        'krym',  40),
  ('alushta',     'Алушта',      'krym',  50),
  ('evpatoriya',  'Евпатория',   'krym',  60),
  ('sudak',       'Судак',       'krym',  70),
  ('feodosiya',   'Феодосия',    'krym',  80),
  ('kerch',       'Керчь',       'krym',  90),
  ('alupka',      'Алупка',      'krym', 100),
  ('gurzuf',      'Гурзуф',      'krym', 110),
  ('koktebel',    'Коктебель',   'krym', 120),
  ('balaklava',   'Балаклава',   'krym', 130),
  ('belogorsk',   'Белогорск',   'krym', 140),
  ('staryy-krym', 'Старый Крым', 'krym', 150),
  ('saki',        'Саки',        'krym', 160),
  ('gaspra',      'Гаспра',      'krym', 170)
ON CONFLICT ("slug") DO NOTHING;

-- Перенос строк в ключи.
--
-- Сопоставление по названию без учёта регистра и приставки «г.» — ровно тот
-- разнобой, ради которого справочник и заводится. Что не сопоставилось,
-- остаётся строкой и ключа не получает: выдумывать город за пользователя
-- миграция не должна. Список несопоставленного показывает
-- `npm run geo:check-cities`.
UPDATE "tour" t
SET "start_city_id" = c."id"
FROM "city" c
WHERE t."start_city_id" IS NULL
  AND t."start_city" IS NOT NULL
  AND c."region_slug" = 'krym'
  AND lower(btrim(regexp_replace(t."start_city", '^\s*(г\.|г|город)\s+|^\s*г\.\s*', '', 'i')))
      = lower(c."title");

UPDATE "place" p
SET "city_id" = c."id"
FROM "city" c
WHERE p."city_id" IS NULL
  AND p."city" IS NOT NULL
  AND c."region_slug" = 'krym'
  AND lower(btrim(regexp_replace(p."city", '^\s*(г\.|г|город)\s+|^\s*г\.\s*', '', 'i')))
      = lower(c."title");

UPDATE "user" u
SET "city_id" = c."id"
FROM "city" c
WHERE u."city_id" IS NULL
  AND u."city" IS NOT NULL
  AND c."region_slug" = 'krym'
  AND lower(btrim(regexp_replace(u."city", '^\s*(г\.|г|город)\s+|^\s*г\.\s*', '', 'i')))
      = lower(c."title");

-- Города подбора: массив строк -> связи.
INSERT INTO "tour_pickup_city" ("tour_id", "city_id")
SELECT t."id", c."id"
FROM "tour" t
CROSS JOIN LATERAL unnest(t."pickup_cities") AS pickup(name)
JOIN "city" c
  ON c."region_slug" = 'krym'
 AND lower(btrim(regexp_replace(pickup.name, '^\s*(г\.|г|город)\s+|^\s*г\.\s*', '', 'i')))
     = lower(c."title")
ON CONFLICT ("tour_id", "city_id") DO NOTHING;
