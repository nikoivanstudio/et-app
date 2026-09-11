import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { normalizeRedirectSource } from '@/entities/redirect/lib/redirect-utils';
import { PUBLIC_TOUR_STATUS } from '@/entities/tour/domain';

import { dbClient } from '@/shared/lib/db';

/**
 * Заливка таблицы переадресаций из CSV (задача B5 в docs/seo/plan.md).
 *
 * Правила живут данными, а не кодом: склеить предстоит около девятисот
 * адресов, и правится этот список по мере разбора справочника. Но
 * редактировать таблицу руками в админке тоже нельзя — нужен обозримый
 * файл под версионным контролем, где у каждого правила видно, зачем оно.
 * Отсюда CSV как источник правды и скрипт как способ его применить.
 *
 * Запуск:
 *   npx tsx prisma/scripts/seed-redirects.ts          # сухой прогон
 *   npx tsx prisma/scripts/seed-redirects.ts --apply  # записать
 *
 * Сухой прогон по умолчанию — намеренно: ошибка в этом файле уводит
 * посетителей и робота с живых страниц, и заметно это будет не сразу.
 */

const CSV_PATH = resolve(process.cwd(), 'prisma/data/redirects.csv');

const isApply = process.argv.includes('--apply');
const isForced = process.argv.includes('--force');

type ParsedRule = {
  source: string;
  destination: string;
  statusCode: number;
  note: string;
  /** Правила с пометкой DRAFT заливаются выключенными. */
  isActive: boolean;
};

/**
 * Разбор строки CSV.
 *
 * Без кавычек и экранирования: в примечаниях запятых нет, а полноценный
 * парсер здесь был бы больше самой задачи. Лишние запятые склеиваются
 * обратно в примечание — так опечатка не теряет данные молча.
 */
const parseLine = (line: string, index: number): ParsedRule | null => {
  const [source, destination, status, ...noteParts] = line.split(',');
  const note = noteParts.join(',').trim();
  const statusCode = Number(status);

  if (!source?.trim()) {
    console.warn(`  строка ${index}: пустой источник — пропущена`);

    return null;
  }

  if (!Number.isFinite(statusCode)) {
    console.warn(`  строка ${index}: код «${status}» не число — пропущена`);

    return null;
  }

  // 410 — единственный код, которому цель не нужна: страница удалена
  // без замены. Для всех остальных пустая цель означала бы редирект
  // в никуда, то есть на главную, — а это худший из возможных исходов:
  // поисковик считает такую склейку «мягким 404» и обнуляет вес адреса.
  if (statusCode !== 410 && !destination?.trim()) {
    console.warn(
      `  строка ${index}: нет цели при коде ${statusCode} — пропущена`
    );

    return null;
  }

  return {
    source: normalizeRedirectSource(source),
    destination: destination?.trim() ?? '',
    statusCode,
    note,
    isActive: !note.startsWith('DRAFT')
  };
};

const parseCsv = (content: string): ParsedRule[] => {
  const rules: ParsedRule[] = [];
  const seen = new Map<string, number>();

  content.split('\n').forEach((raw, idx) => {
    const line = raw.trim();
    const number = idx + 1;

    if (!line || line.startsWith('#') || line.startsWith('source,')) {
      return;
    }

    const rule = parseLine(line, number);

    if (!rule) {
      return;
    }

    // Дубль источника — не мелочь: в таблице у `source` уникальный индекс,
    // и последняя строка молча затёрла бы первую, а какое из двух правил
    // действует, выяснилось бы только по жалобе.
    const previous = seen.get(rule.source);

    if (previous) {
      console.warn(
        `  строка ${number}: источник ${rule.source} уже описан в строке ${previous} — пропущена`
      );

      return;
    }

    // Цепочка A→B→C стоит лишнего перехода и теряет часть веса, а цикл
    // A→B→A вешает браузер на ERR_TOO_MANY_REDIRECTS.
    if (rule.destination === rule.source) {
      console.warn(
        `  строка ${number}: правило указывает само на себя — пропущена`
      );

      return;
    }

    seen.set(rule.source, number);
    rules.push(rule);
  });

  return rules;
};

/** Цепочки: цель одного правила сама является источником другого. */
const findChains = (rules: ParsedRule[]): string[] => {
  const sources = new Set(
    rules.filter(rule => rule.isActive).map(r => r.source)
  );

  return rules
    .filter(
      rule =>
        rule.isActive &&
        rule.destination &&
        sources.has(normalizeRedirectSource(rule.destination))
    )
    .map(rule => `${rule.source} → ${rule.destination} → …`);
};

/**
 * Правила из секции каталогов уводят с живых страниц на `/tours`. Пока
 * каталог пуст (задача A4), это означает 301 на страницу без единой
 * карточки — то есть потерю всего, что на этих адресах накоплено.
 */
const hasPublishedTours = async (): Promise<boolean> => {
  const count = await dbClient.tour.count({
    where: { status: PUBLIC_TOUR_STATUS }
  });

  console.log(`Опубликованных туров в базе: ${count}`);

  return count > 0;
};

/**
 * Правила, которые есть в базе, но которых уже нет в CSV.
 *
 * Заливка идёт upsert'ом и ничего не удаляет — это осознанно: правила
 * заводят и руками, мимо файла. Но из-за этого строка, удалённая из CSV,
 * продолжает действовать в бою, и увидеть это по файлу нельзя. Отсюда
 * отчёт: скрипт не решает за человека, а показывает расхождение.
 *
 * Удалять такие правила сразу нельзя ещё и потому, что выключенное
 * правило — это история решения, а не мусор.
 */
const reportOrphans = async (rules: ParsedRule[]) => {
  const inFile = new Set(rules.map(rule => rule.source));

  const stored = await dbClient.redirect.findMany({
    select: { source: true, destination: true, isActive: true }
  });

  const orphans = stored.filter(rule => !inFile.has(rule.source));

  if (!orphans.length) {
    return;
  }

  console.warn(
    `\nВ базе есть правила, которых нет в CSV: ${orphans.length}.` +
      '\nЕсли они удалены из файла намеренно — снимите их и в базе.'
  );
  orphans.forEach(rule => {
    console.warn(
      `  ${rule.source} → ${rule.destination}` +
        `${rule.isActive ? '' : ' (выключено)'}`
    );
  });
};

const main = async () => {
  const content = readFileSync(CSV_PATH, 'utf8');

  console.log(`Разбор ${CSV_PATH}`);

  const rules = parseCsv(content);
  const active = rules.filter(rule => rule.isActive);
  const drafts = rules.length - active.length;

  console.log(`\nПравил разобрано: ${rules.length}`);
  console.log(`  действующих: ${active.length}`);
  console.log(`  черновиков (DRAFT, зальются выключенными): ${drafts}`);

  const chains = findChains(rules);

  if (chains.length) {
    console.warn('\nЦепочки редиректов — каждая стоит лишнего перехода:');
    chains.forEach(chain => console.warn(`  ${chain}`));
  }

  const goesToCatalog = active.some(rule => rule.destination === '/tours');

  if (goesToCatalog && !(await hasPublishedTours())) {
    console.warn(
      '\nВ CSV есть действующие правила на /tours, а опубликованных туров нет.\n' +
        'Такая склейка уводит людей и робота на пустую страницу.\n' +
        'Сначала задача A4 (завести и опубликовать туры), либо --force.'
    );

    if (!isForced) {
      return;
    }
  }

  if (!isApply) {
    console.log('\nСухой прогон. Чтобы записать — запустите с флагом --apply.');
    console.log('Будет записано (первые 10):');
    rules.slice(0, 10).forEach(rule => {
      console.log(
        `  ${rule.source} → ${rule.destination || '(410)'} [${rule.statusCode}]` +
          `${rule.isActive ? '' : ' (выключено)'}`
      );
    });

    return;
  }

  // Upsert, а не пересоздание таблицы: правила заводят и вручную — через
  // админку или SQL, — и стирать их при каждой заливке CSV нельзя.
  for (const rule of rules) {
    await dbClient.redirect.upsert({
      where: { source: rule.source },
      create: {
        source: rule.source,
        destination: rule.destination,
        statusCode: rule.statusCode,
        isActive: rule.isActive,
        note: rule.note || null
      },
      update: {
        destination: rule.destination,
        statusCode: rule.statusCode,
        isActive: rule.isActive,
        note: rule.note || null
      }
    });
  }

  console.log(`\nЗаписано правил: ${rules.length}`);

  await reportOrphans(rules);
};

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => dbClient.$disconnect());
