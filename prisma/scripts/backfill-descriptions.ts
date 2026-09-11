import 'dotenv/config';

import { dbClient } from '@/shared/lib/db';
import { buildDescription } from '@/shared/lib/seo/description';

/**
 * Разовый бэкфилл описаний постов.
 *
 * Задача B1 из docs/seo/plan.md. При импорте из WordPress в поле
 * `description` записывалась строка-заглушка `'description'` — она
 * уходила и в `<meta name="description">`, и в `og:description`.
 * Фолбэк в `shared/lib/seo/description.ts` закрывает проблему на рендере,
 * но в базе заглушка остаётся и продолжает показываться редактору
 * в админке как «описание». Скрипт переписывает её текстом из контента.
 *
 * Запуск:
 *   npx tsx prisma/scripts/backfill-descriptions.ts          # сухой прогон
 *   npx tsx prisma/scripts/backfill-descriptions.ts --apply  # записать
 *
 * Сухой прогон — поведение по умолчанию намеренно: скрипт правит сотни
 * строк, и запустить его случайно не должно быть возможно. Перед --apply
 * сделайте дамп таблицы post.
 */

const BATCH_SIZE = 200;

const isApply = process.argv.includes('--apply');

/** Значения, которые надо переписать. Совпадает с PLACEHOLDERS в seo/description.ts. */
const PLACEHOLDERS = [
  'description',
  'descriptions',
  'meta description',
  'описание',
  'заголовок страницы'
];

const main = async () => {
  const posts = await dbClient.post.findMany({
    where: {
      OR: [
        { description: { in: PLACEHOLDERS, mode: 'insensitive' } },
        { description: '' }
      ]
    },
    select: { id: true, slug: true, description: true, content: true }
  });

  console.log(
    `Найдено записей с пустым или заглушечным описанием: ${posts.length}`
  );

  const updates: { id: number; slug: string; description: string }[] = [];
  const skipped: string[] = [];

  for (const post of posts) {
    // Передаём пустое явное описание: заглушку переписываем в любом случае.
    const description = buildDescription('', post.content);

    if (!description) {
      skipped.push(post.slug);
      continue;
    }

    updates.push({ id: post.id, slug: post.slug, description });
  }

  console.log(`Можно заполнить: ${updates.length}`);
  console.log(`Нечем заполнить (пустой контент): ${skipped.length}`);

  if (skipped.length) {
    console.log('Первые 20 таких страниц:');
    skipped.slice(0, 20).forEach(slug => console.log(`  /${slug}`));
  }

  console.log('\nПримеры того, что будет записано:');
  updates.slice(0, 5).forEach(({ slug, description }) => {
    console.log(`  /${slug}\n    ${description}`);
  });

  if (!isApply) {
    console.log('\nСухой прогон. Чтобы записать — запустите с флагом --apply.');

    return;
  }

  // Батчами, а не одной транзакцией: сотни апдейтов одной транзакцией
  // держат блокировки на таблице дольше, чем нужно, а операция
  // идемпотентна — повторный запуск просто не найдёт этих записей.
  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE);

    await dbClient.$transaction(
      batch.map(({ id, description }) =>
        dbClient.post.update({ where: { id }, data: { description } })
      )
    );

    console.log(`Записано ${Math.min(i + BATCH_SIZE, updates.length)} из ${updates.length}`);
  }

  console.log('Готово.');
};

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => dbClient.$disconnect());
