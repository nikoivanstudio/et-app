import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { dbClient } from '@/shared/lib/db';

/**
 * Переименование слагов с HTML-сущностями (задача B8 в docs/seo/plan.md).
 *
 * Из движка в адреса приехали токены сущностей: `laquo`/`raquo` вместо
 * кавычек, `mdash`/`8212` вместо тире, `nbsp` вместо пробела. Адрес
 * `/chto-takoe-laquo-yajla-raquo` человек читает как мусор, а поисковик —
 * как лишние слова в URL, по которым страница и ранжируется.
 *
 * Источник правды — `prisma/data/b8-slugs.csv`: выгрузка из базы, сверенная
 * вручную. Скрипт не вычисляет новые слаги сам и не доверяет своему
 * преобразованию — он сверяет колонку `new_slug` из файла с тем, что
 * получается по правилу, и останавливается на расхождении. Иначе первая же
 * неучтённая сущность молча увела бы страницу на битый адрес.
 *
 * Запуск:
 *   npx tsx prisma/scripts/rename-slugs.ts          # сухой прогон
 *   npx tsx prisma/scripts/rename-slugs.ts --apply  # переименовать
 *
 * Порядок обязателен: сначала этот скрипт, потом заливка правил
 * (`seed-redirects.ts`). Правило в прокси срабатывает раньше
 * маршрутизации, поэтому 301, залитый до переименования, уводил бы
 * на слаг, которого ещё нет, — то есть в 404 на всех сорока четырёх
 * адресах сразу.
 */

/**
 * Выгрузка лежит рядом с `redirects.csv`, а не в `docs/`: скрипт запускают
 * на проде, а `docs/` в гит не уезжает — оттуда файла на сервере просто
 * нет, и B8 упала бы на первом же шаге выкатки.
 */
const CSV_PATH = resolve(process.cwd(), 'prisma/data/b8-slugs.csv');

const isApply = process.argv.includes('--apply');

/** Токены сущностей, которые встречаются в слагах этой базы. */
const ENTITY_TOKENS = [
  'laquo',
  'raquo',
  'mdash',
  'ndash',
  'nbsp',
  'thinsp',
  '8212',
  '8211'
].join('|');

/**
 * Выкинуть токены сущностей и склеить дефисы.
 *
 * Прогон в цикле, а не один проход: у `laquo-…-raquo` сущности стоят
 * по обе стороны, и соседние токены (`-nbsp-nbsp-`) за один проход
 * регулярное выражение съедает через один — из `a-nbsp-s-nbsp-pushkina`
 * получилось бы `a-s-nbsp-pushkina`.
 */
export const stripEntityTokens = (slug: string): string => {
  const inner = new RegExp(`-(${ENTITY_TOKENS})(?=-|$)`, 'g');
  const leading = new RegExp(`^(${ENTITY_TOKENS})-`, 'g');

  let current = slug;
  let previous = '';

  while (previous !== current) {
    previous = current;
    current = current.replace(inner, '').replace(leading, '');
  }

  return current.replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
};

type RenameRow = {
  id: number;
  oldSlug: string;
  newSlug: string;
};

/**
 * Разбор выгрузки. Строки с пометкой `DUPLICATE:` пропускаются: их новый
 * адрес занят страницей о том же объекте, и это не переименование,
 * а склейка дублей — задача B6.
 */
const parseCsv = (content: string): RenameRow[] => {
  const rows: RenameRow[] = [];

  content.split('\n').forEach((raw, idx) => {
    const line = raw.trim();

    if (!line || line.startsWith('#') || line.startsWith('id,')) {
      return;
    }

    const [id, oldSlug, newSlug, action] = line.split(',');

    if (action?.trim() !== 'rename') {
      return;
    }

    const expected = stripEntityTokens(oldSlug);

    if (expected !== newSlug) {
      throw new Error(
        `строка ${idx + 1}: в файле ${oldSlug} → ${newSlug}, ` +
          `а по правилу выходит ${expected}. Расхождение разбирается руками.`
      );
    }

    rows.push({ id: Number(id), oldSlug, newSlug });
  });

  return rows;
};

/**
 * Сверка с базой до единой записи.
 *
 * Выгрузка сделана из дампа, а применяется к живой базе, и за это время
 * запись могли переименовать, удалить или завести на новом адресе другую.
 * Переименовать «примерно то, что нашлось» здесь нельзя: у `slug`
 * уникальный индекс, и промах — это либо потерянный адрес, либо падение
 * посреди прогона с половиной применённых правок.
 */
const verify = async (rows: RenameRow[]) => {
  const problems: string[] = [];

  const existing = await dbClient.post.findMany({
    where: { id: { in: rows.map(row => row.id) } },
    select: { id: true, slug: true }
  });

  const byId = new Map(existing.map(post => [post.id, post.slug]));

  rows.forEach(row => {
    const actual = byId.get(row.id);

    if (!actual) {
      problems.push(`id ${row.id}: записи нет в базе`);

      return;
    }

    if (actual !== row.oldSlug) {
      problems.push(
        `id ${row.id}: в базе слаг ${actual}, в файле ${row.oldSlug}`
      );
    }
  });

  const taken = await dbClient.post.findMany({
    where: { slug: { in: rows.map(row => row.newSlug) } },
    select: { id: true, slug: true }
  });

  taken.forEach(post => {
    problems.push(`новый слаг ${post.slug} уже занят записью id ${post.id}`);
  });

  return problems;
};

const main = async () => {
  const rows = parseCsv(readFileSync(CSV_PATH, 'utf8'));

  console.log(`Разбор ${CSV_PATH}`);
  console.log(`Переименований в файле: ${rows.length}`);

  const problems = await verify(rows);

  if (problems.length) {
    console.error('\nБаза разошлась с выгрузкой — ничего не меняем:');
    problems.forEach(problem => console.error(`  ${problem}`));
    process.exitCode = 1;

    return;
  }

  console.log('Сверка с базой пройдена: все записи на месте, адреса свободны.');

  if (!isApply) {
    console.log('\nСухой прогон. Чтобы переименовать — флаг --apply.');
    rows.slice(0, 10).forEach(row => {
      console.log(`  /${row.oldSlug} → /${row.newSlug}`);
    });
    console.log(`  … и ещё ${Math.max(0, rows.length - 10)}`);

    return;
  }

  // Одной транзакцией: половина переименованных страниц без второй
  // половины — это состояние, из которого выгрузка уже не описывает базу,
  // и повторный прогон пришлось бы разбирать вручную.
  await dbClient.$transaction(
    rows.map(row =>
      dbClient.post.update({
        where: { id: row.id },
        data: { slug: row.newSlug }
      })
    )
  );

  console.log(`\nПереименовано: ${rows.length}`);
  console.log(
    'Дальше — заливка правил: npx tsx prisma/scripts/seed-redirects.ts --apply'
  );
};

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => dbClient.$disconnect());
