-- Tour content: raw HTML (TEXT) -> structured blocks (JSONB).
--
-- Раньше `tour.content` хранил рукописный HTML, который рендерился через
-- dangerouslySetInnerHTML. Новый формат хранит типизированные блоки
-- (lead / tags / route / price / tickets / info / awaits) и рендерится без
-- innerHTML. Старый HTML НЕ конвертируется в блочную структуру.
--
-- Продуктовое решение: существующие туры удаляются и пересоздаются в новом
-- редакторе. review и activity ссылаются на tour с ON DELETE RESTRICT, поэтому
-- удаляются первыми; photo и order используют ON DELETE SET NULL и сохраняются
-- (их tour_id обнуляется).
--
-- ВНИМАНИЕ: миграция удаляет ВСЕ туры, а также отзывы и активности туров.
-- Перед прогоном на проде убедись, что это допустимо (сделай бэкап БД).

-- 1) Удаляем туры и зависящие от них строки (RESTRICT).
DELETE FROM "review"   WHERE "tour_id" IS NOT NULL;
DELETE FROM "activity" WHERE "tour_id" IS NOT NULL;
DELETE FROM "tour";

-- 2) Reconcile колонок, которые могли появиться через `prisma db push`.
ALTER TABLE "tour" DROP COLUMN IF EXISTS "intro";
ALTER TABLE "tour" DROP COLUMN IF EXISTS "route_stops";
ALTER TABLE "tour" DROP COLUMN IF EXISTS "conditions";

-- 3) Смена типа content: TEXT (HTML) -> JSONB (блоки).
--    Таблица tour уже пуста (шаг 1), поэтому NOT NULL добавляется безопасно.
ALTER TABLE "tour" DROP COLUMN IF EXISTS "content";
ALTER TABLE "tour" ADD COLUMN "content" JSONB NOT NULL;
