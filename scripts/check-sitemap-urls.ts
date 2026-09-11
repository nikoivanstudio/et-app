/**
 * Проверка адресов из sitemap (часть задачи H2).
 *
 * Отдельным скриптом, а не тестом: это сетевой обход восьмисот адресов
 * живого сайта. На каждый коммит он не нужен и был бы вредным — минуты
 * ожидания в CI и лишняя нагрузка на прод. Раз в сутки по расписанию —
 * ровно то, что требуется: битый адрес в карте сайта обнаруживается
 * в тот же день, а не через месяц из Вебмастера.
 *
 * Запуск:
 *   npx tsx scripts/check-sitemap-urls.ts
 *   npx tsx scripts/check-sitemap-urls.ts https://energy-tur.ru
 *
 * Код возврата 1, если нашлись адреса с ответом, отличным от 200,
 * — по нему и падает проверка в CI.
 */

const DEFAULT_ORIGIN = 'https://energy-tur.ru';

/** Сколько адресов проверяем одновременно. */
const CONCURRENCY = 8;

/** Ответ дольше этого считаем отказом: робот ждёт не бесконечно. */
const TIMEOUT_MS = 15_000;

const siteOrigin = (process.argv[2] || DEFAULT_ORIGIN).replace(/\/$/, '');

type Problem = {
  url: string;
  status: number | string;
};

const extractTags = (xml: string, tag: string): string[] =>
  [...xml.matchAll(new RegExp(`<${tag}>(.*?)</${tag}>`, 'g'))].map(match =>
    match[1].trim()
  );

const fetchText = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });

  if (!response.ok) {
    throw new Error(`${url} отдал ${response.status}`);
  }

  return response.text();
};

/**
 * Адреса из индекса и всех его секций.
 *
 * Индекс появился в B10: до него sitemap был одним файлом на 868 адресов.
 */
const collectUrls = async (): Promise<string[]> => {
  const indexXml = await fetchText(`${siteOrigin}/sitemap.xml`);
  const sections = extractTags(indexXml, 'loc');

  if (!sections.length) {
    throw new Error('В /sitemap.xml нет ни одной секции');
  }

  console.log(`Секций в индексе: ${sections.length}`);

  const urls: string[] = [];

  for (const section of sections) {
    const xml = await fetchText(section);
    const locs = extractTags(xml, 'loc');

    console.log(`  ${section} — адресов: ${locs.length}`);
    urls.push(...locs);
  }

  return urls;
};

/**
 * Статус одного адреса.
 *
 * GET, а не HEAD: Next отдаёт на HEAD не всё то же самое, что на GET,
 * и проверка HEAD'ом даёт ложное спокойствие. Тело нам не нужно —
 * сразу отменяем чтение.
 */
const checkUrl = async (url: string): Promise<Problem | null> => {
  try {
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });

    await response.body?.cancel();

    // Редирект из sitemap — тоже дефект: в карте должен стоять конечный
    // адрес, иначе робот тратит обход на переходы.
    return response.status === 200 ? null : { url, status: response.status };
  } catch (error) {
    return {
      url,
      status: error instanceof Error ? error.message : 'ошибка запроса'
    };
  }
};

const checkAll = async (urls: string[]): Promise<Problem[]> => {
  const problems: Problem[] = [];
  let index = 0;

  const worker = async () => {
    while (index < urls.length) {
      const current = urls[index];

      index += 1;

      const problem = await checkUrl(current);

      if (problem) {
        problems.push(problem);
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker)
  );

  return problems;
};

const main = async () => {
  console.log(`Проверяю sitemap на ${siteOrigin}`);

  const urls = await collectUrls();
  const unique = [...new Set(urls)];

  if (unique.length !== urls.length) {
    console.warn(
      `Внимание: ${urls.length - unique.length} адресов повторяются в разных секциях`
    );
  }

  console.log(`\nПроверяю ${unique.length} адресов…`);

  const problems = await checkAll(unique);

  if (!problems.length) {
    console.log('Все адреса отвечают 200.');

    return;
  }

  console.error(`\nПроблемных адресов: ${problems.length}`);
  problems
    .sort((a, b) => a.url.localeCompare(b.url))
    .forEach(({ url, status }) => console.error(`  ${status}  ${url}`));

  process.exitCode = 1;
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
