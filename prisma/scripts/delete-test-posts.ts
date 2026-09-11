import 'dotenv/config';

import { normalizeRedirectSource } from '@/entities/redirect/lib/redirect-utils';

import { dbClient } from '@/shared/lib/db';

/**
 * Удаление тестовых страниц (задача B3 в docs/seo/plan.md).
 *
 * Пять страниц Lorem ipsum и две со слагом-UUID: остатки наполнения,
 * которые попали в индекс наравне с содержательными материалами. Замены
 * у них нет и быть не может, поэтому 410, а не 301, — правила уже лежат
 * в `prisma/data/redirects.csv`.
 *
 * Список зашит в код, а не читается из файла: страниц семь, они названы
 * поимённо в плане, и подставлять сюда произвольный список — последнее,
 * чего хочется от скрипта, который удаляет материалы без возможности
 * отката.
 *
 * Запуск:
 *   npx tsx prisma/scripts/delete-test-posts.ts          # сухой прогон
 *   npx tsx prisma/scripts/delete-test-posts.ts --apply  # удалить
 */

const isApply = process.argv.includes('--apply');

/** Семь адресов из B3. Сверены с базой по дампу от 11.09.2026. */
const TEST_SLUGS = [
  'lorem-ipsum-dolor-sit-amet-consectetur-adipisicing-elit',
  'lorem-ipsum-dolor-sit-amet-consectetur-adipisicing-elit-2',
  'lorem-ipsum-dolor-sit-amet-consectetur-adipisicing-elit-3',
  'lorem-ipsum-dolor-sit-amet-consectetur-adipisicing-elit-4',
  'lorem-ipsum-dolor-sit-amet-consectetur-adipisicing-elit-5',
  '92a7b596-a1f2-4673-9124-af3db5a24fbf',
  '1b24a56a-fe47-45bc-b765-7c6b8cc77ec8'
];

/**
 * Проверка, что 410 уже заведён и включён.
 *
 * Порядок здесь обратный тому, что в B8: сначала правило, потом удаление.
 * Удалённая страница без правила отдаёт 404, а 404 поисковик перепроверяет
 * месяцами, прежде чем выбросить адрес из индекса. С 410 — сразу и
 * без возвратов. Промежуток между двумя шагами и есть разница между
 * «ушло из индекса за неделю» и «висит полгода».
 */
const findMissingRules = async (): Promise<string[]> => {
  const sources = TEST_SLUGS.map(slug => normalizeRedirectSource(`/${slug}`));

  const rules = await dbClient.redirect.findMany({
    where: { source: { in: sources }, statusCode: 410, isActive: true },
    select: { source: true }
  });

  const covered = new Set(rules.map(rule => rule.source));

  return sources.filter(source => !covered.has(source));
};

const main = async () => {
  const posts = await dbClient.post.findMany({
    where: { slug: { in: TEST_SLUGS } },
    select: { id: true, slug: true, title: true }
  });

  console.log(`Найдено в базе: ${posts.length} из ${TEST_SLUGS.length}`);
  posts.forEach(post => {
    console.log(`  id ${post.id}  /${post.slug}  «${post.title}»`);
  });

  const missingInDb = TEST_SLUGS.filter(
    slug => !posts.some(post => post.slug === slug)
  );

  if (missingInDb.length) {
    console.log('\nНет в базе (возможно, уже удалены):');
    missingInDb.forEach(slug => console.log(`  /${slug}`));
  }

  const missingRules = await findMissingRules();

  if (missingRules.length) {
    console.error(
      '\nНе для всех адресов заведён действующий 410 — удалять рано.\n' +
        'Сначала: npx tsx prisma/scripts/seed-redirects.ts --apply'
    );
    missingRules.forEach(source => console.error(`  ${source}`));
    process.exitCode = 1;

    return;
  }

  console.log('\n410 заведён и включён для всех семи адресов.');

  if (!posts.length) {
    console.log('Удалять нечего — задача уже применена к этой базе.');

    return;
  }

  if (!isApply) {
    console.log('\nСухой прогон. Чтобы удалить — флаг --apply.');

    return;
  }

  const { count } = await dbClient.post.deleteMany({
    where: { id: { in: posts.map(post => post.id) } }
  });

  console.log(`\nУдалено записей: ${count}`);
};

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => dbClient.$disconnect());
