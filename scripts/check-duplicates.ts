/**
 * Замер уникальности справочника: сравнение с сайтом-донором (задача F6).
 *
 * Проверка B11 делалась руками: абзац из середины текста — поиск по точной
 * фразе. На десяти страницах это работает, на 763 — нет, и «совпадений
 * не нашлось» там ничего не доказывает: поисковая выдача кавычки не держит.
 *
 * Здесь то же самое считается механически. Донорский сайт выкачивается
 * по его же карте сайта, тексты с обеих сторон приводятся к словам, и по
 * шинглам в восемь слов считается доля совпавшего. Результат
 * воспроизводим и не зависит от выдачи.
 *
 * Сеть, а не тест: полный обход донора — это тысячи запросов к чужому
 * сайту. Запускается руками и редко, результат кладётся в кэш и в CSV.
 *
 * Запуск:
 *   npx tsx scripts/check-duplicates.ts                 # обход + отчёт
 *   npx tsx scripts/check-duplicates.ts --no-crawl      # только по кэшу
 *   npx tsx scripts/check-duplicates.ts --donor example.com
 *
 * Отчёт — prisma/data/duplicates.csv, его читает prisma/scripts/rewrite-queue.ts.
 */

import 'dotenv/config';

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { dbClient } from '@/shared/lib/db';

/** Донор по умолчанию: на нём найдены копии в проверке B11. */
const DEFAULT_DONOR = 'jalita.com';

/** Разделы донора, где лежит краеведение. Новости и объявления не нужны. */
const DONOR_SECTIONS = ['guidebook', 'big_yalta'];

/** Длина шингла в словах. Восемь — длиннее случайного совпадения оборота. */
const SHINGLE = 8;

/** Одновременных запросов к донору. Больше — невежливо. */
const CONCURRENCY = 2;

/** Пауза между запросами одного потока. */
const DELAY_MS = 600;

/** Короче этого сравнивать нечего: шинглов не наберётся. */
const MIN_WORDS = 30;

const CACHE_ROOT = path.join(process.cwd(), '.cache', 'duplicates');
/**
 * Отчёт лежит рядом с `rewrite-queue.csv`, а не в `docs/`: его читает
 * `prisma/scripts/rewrite-queue.ts`, а `docs/` в гит не уезжает. Без файла
 * очередь молча собирается по одному объёму — ошибки не будет, будет
 * неверный приоритет, и заметить это по выводу нельзя.
 */
const REPORT = path.join(process.cwd(), 'prisma', 'data', 'duplicates.csv');

const donor = process.argv.includes('--donor')
  ? process.argv[process.argv.indexOf('--donor') + 1]
  : DEFAULT_DONOR;
const skipCrawl = process.argv.includes('--no-crawl');

const cacheDir = path.join(CACHE_ROOT, donor);

/** Текст в поток слов: теги и разметка выброшены, ё сведена к е. */
const toWords = (html: string): string[] =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^а-яa-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

const toShingles = (words: string[]): Set<string> => {
  const set = new Set<string>();

  for (let i = 0; i + SHINGLE <= words.length; i += 1) {
    set.add(words.slice(i, i + SHINGLE).join(' '));
  }

  return set;
};

/**
 * Имя файла в кэше. Слэши кодируются процентами, а не заменяются
 * подчёркиванием: у донора есть разделы вида `cave_crimea`, и обратное
 * преобразование подчёркиванием давало бы несуществующий адрес.
 */
const cacheName = (url: string): string =>
  encodeURIComponent(url.replace(`https://${donor}/`, ''));

const cacheUrl = (file: string): string =>
  `https://${donor}/${decodeURIComponent(file)}`;

const fetchSitemap = async (): Promise<string[]> => {
  const response = await fetch(`https://${donor}/sitemap.xml`);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);

  return urls.filter(url =>
    DONOR_SECTIONS.some(section =>
      url.startsWith(`https://${donor}/${section}/`)
    )
  );
};

const crawl = async (urls: string[]): Promise<void> => {
  await mkdir(cacheDir, { recursive: true });

  const pending = urls.filter(
    url => !existsSync(path.join(cacheDir, cacheName(url)))
  );

  console.log(`В карте сайта: ${urls.length}, в кэше нет: ${pending.length}`);

  let done = 0;

  const worker = async (offset: number) => {
    for (let i = offset; i < pending.length; i += CONCURRENCY) {
      const url = pending[i];

      try {
        const response = await fetch(url, {
          headers: {
            'user-agent': 'Mozilla/5.0 (compatible; energy-tur dup-check)'
          },
          signal: AbortSignal.timeout(25_000)
        });

        if (response.ok) {
          await writeFile(
            path.join(cacheDir, cacheName(url)),
            await response.text()
          );
        }
      } catch {
        // Одна недокачанная страница донора отчёт не ломает: она просто
        // не попадёт в корпус, и совпадение с ней не найдётся.
      }

      done += 1;

      if (done % 100 === 0) {
        console.log(`  скачано ${done} из ${pending.length}`);
      }

      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  };

  const workers: Promise<void>[] = [];

  for (let offset = 0; offset < CONCURRENCY; offset += 1) {
    workers.push(worker(offset));
  }

  await Promise.all(workers);
};

/** Шингл → адрес донора, где он встретился первым. */
const buildIndex = async (): Promise<Map<string, string>> => {
  const index = new Map<string, string>();
  const files = await readdir(cacheDir);

  for (const file of files) {
    const url = cacheUrl(file);
    const words = toWords(await readFile(path.join(cacheDir, file), 'utf8'));

    for (const shingle of toShingles(words)) {
      if (!index.has(shingle)) {
        index.set(shingle, url);
      }
    }
  }

  console.log(`Корпус донора: ${files.length} страниц, ${index.size} шинглов`);

  return index;
};

const main = async () => {
  if (!skipCrawl) {
    await crawl(await fetchSitemap());
  }

  if (!existsSync(cacheDir)) {
    console.error(`Кэша нет: ${cacheDir}. Запустите без --no-crawl.`);
    process.exitCode = 1;

    return;
  }

  const index = await buildIndex();

  const posts = await dbClient.post.findMany({
    select: { slug: true, content: true },
    orderBy: { slug: 'asc' }
  });

  const rows = posts.map(post => {
    const words = toWords(post.content ?? '');
    const shingles = toShingles(words);

    if (shingles.size < MIN_WORDS - SHINGLE) {
      return {
        slug: post.slug,
        words: words.length,
        pct: 0,
        src: '',
        srcPct: 0
      };
    }

    let hits = 0;
    const bySource = new Map<string, number>();

    for (const shingle of shingles) {
      const url = index.get(shingle);

      if (!url) {
        continue;
      }

      hits += 1;
      bySource.set(url, (bySource.get(url) ?? 0) + 1);
    }

    const [top] = [...bySource.entries()].sort((a, b) => b[1] - a[1]);

    return {
      slug: post.slug,
      words: words.length,
      pct: Math.round((hits / shingles.size) * 100),
      src: top ? top[0] : '',
      srcPct: top ? Math.round((top[1] / shingles.size) * 100) : 0
    };
  });

  rows.sort((a, b) => b.pct - a.pct);

  await writeFile(
    REPORT,
    ['slug,words,dup_pct,src_pct,src']
      .concat(
        rows.map(
          row => `${row.slug},${row.words},${row.pct},${row.srcPct},${row.src}`
        )
      )
      .join('\n') + '\n'
  );

  const buckets: [string, (pct: number) => boolean][] = [
    ['90–100% — дословная копия', pct => pct >= 90],
    ['70–90% — копия с правками', pct => pct >= 70 && pct < 90],
    ['50–70% — копия наполовину', pct => pct >= 50 && pct < 70],
    ['30–50% — заимствованы куски', pct => pct >= 30 && pct < 50],
    ['10–30% — отдельные абзацы', pct => pct >= 10 && pct < 30],
    ['0–10% — совпадений нет', pct => pct < 10]
  ];

  console.log(`\nПроверено страниц: ${rows.length}, донор: ${donor}`);

  for (const [label, test] of buckets) {
    console.log(`  ${label}: ${rows.filter(row => test(row.pct)).length}`);
  }

  console.log(`\nОтчёт: ${path.relative(process.cwd(), REPORT)}`);
};

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => dbClient.$disconnect());
