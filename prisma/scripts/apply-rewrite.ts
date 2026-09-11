/**
 * Заливка переписанных текстов в базу (задача F6).
 *
 * Тексты пишутся не прямо в базу, а файлами prisma/data/rewrite/<slug>.html:
 * их видно в ревью, они лежат в гите, и залить их можно повторно на другую
 * копию базы. Формат файла — заголовок в front matter, тело в HTML,
 * как контент и лежит в поле `content` после импорта из WordPress.
 *
 *   ---
 *   title: Мангуп-Кале
 *   description: Короткое описание для выдачи, 120–160 знаков.
 *   ---
 *   <p>Текст…</p>
 *
 * Запуск:
 *   npx tsx prisma/scripts/apply-rewrite.ts                  # сухой прогон
 *   npx tsx prisma/scripts/apply-rewrite.ts --batch 3        # только порция 3
 *   npx tsx prisma/scripts/apply-rewrite.ts --batch 3 --apply
 *
 * Сухой прогон по умолчанию: скрипт перезаписывает тексты страниц,
 * и запустить его случайно не должно быть возможно.
 */

import 'dotenv/config';

import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { dbClient } from '@/shared/lib/db';

const SOURCE = path.join(process.cwd(), 'prisma', 'data', 'rewrite');
const QUEUE = path.join(process.cwd(), 'prisma', 'data', 'rewrite-queue.csv');

/**
 * Ниже этой доли от исходной длины заливка считается ошибкой.
 * Рерайт короче половины оригинала — это не рерайт, а потеря материала,
 * и чаще всего означает оборванный файл.
 */
const MIN_LENGTH_RATIO = 0.5;

const isApply = process.argv.includes('--apply');
const batchArg = process.argv.includes('--batch')
  ? Number(process.argv[process.argv.indexOf('--batch') + 1])
  : null;

type Parsed = { title?: string; description?: string; content: string };

const parse = (raw: string): Parsed => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { content: raw.trim() };
  }

  const meta: Record<string, string> = {};

  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');

    if (separator > 0) {
      meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
    }
  }

  return {
    title: meta.title,
    description: meta.description,
    content: match[2].trim()
  };
};

const batchSlugs = async (batch: number): Promise<Set<string>> => {
  if (!existsSync(QUEUE)) {
    throw new Error(
      `Очереди ${path.relative(process.cwd(), QUEUE)} нет. Соберите: npx tsx prisma/scripts/rewrite-queue.ts`
    );
  }

  const [, ...lines] = (await readFile(QUEUE, 'utf8')).trim().split('\n');

  return new Set(
    lines
      .map(line => line.split(','))
      .filter(columns => Number(columns[0]) === batch)
      .map(columns => columns[2])
  );
};

const main = async () => {
  if (!existsSync(SOURCE)) {
    console.log(
      `Каталог ${path.relative(process.cwd(), SOURCE)} пуст — заливать нечего.`
    );

    return;
  }

  const wanted = batchArg ? await batchSlugs(batchArg) : null;

  if (wanted && !wanted.size) {
    console.log(`В очереди нет порции ${batchArg}.`);

    return;
  }

  const files = (await readdir(SOURCE))
    .filter(file => file.endsWith('.html'))
    .filter(file => !wanted || wanted.has(file.replace(/\.html$/, '')));

  if (!files.length) {
    console.log(
      batchArg
        ? `Для порции ${batchArg} файлов ещё нет: ${[...(wanted ?? [])].join(', ')}`
        : 'Файлов рерайта нет.'
    );

    return;
  }

  const updates: { id: number; slug: string; data: Parsed; before: number }[] =
    [];
  const problems: string[] = [];

  for (const file of files) {
    const slug = file.replace(/\.html$/, '');
    const parsed = parse(await readFile(path.join(SOURCE, file), 'utf8'));
    const post = await dbClient.post.findUnique({
      where: { slug },
      select: { id: true, content: true }
    });

    if (!post) {
      problems.push(`${slug}: такой страницы в базе нет`);
      continue;
    }

    if (!parsed.content) {
      problems.push(`${slug}: пустое тело файла`);
      continue;
    }

    const ratio =
      parsed.content.length / Math.max(post.content?.length ?? 1, 1);

    if (ratio < MIN_LENGTH_RATIO) {
      problems.push(
        `${slug}: текст короче оригинала в ${(1 / ratio).toFixed(1)} раза — похоже на обрыв`
      );
      continue;
    }

    updates.push({
      id: post.id,
      slug,
      data: parsed,
      before: post.content?.length ?? 0
    });
  }

  console.log(`Файлов: ${files.length}, готовы к заливке: ${updates.length}\n`);

  for (const update of updates) {
    console.log(
      `  /${update.slug}: ${update.before} → ${update.data.content.length} знаков` +
        (update.data.title ? `, заголовок «${update.data.title}»` : '')
    );
  }

  if (problems.length) {
    console.log('\nНе заливается:');
    problems.forEach(problem => console.log(`  ${problem}`));
  }

  if (!isApply) {
    console.log('\nСухой прогон. Чтобы записать — запустите с флагом --apply.');

    return;
  }

  if (problems.length) {
    console.error(
      '\nЕсть проблемные файлы — порция не заливается целиком. Исправьте и повторите.'
    );
    process.exitCode = 1;

    return;
  }

  await dbClient.$transaction(
    updates.map(update =>
      dbClient.post.update({
        where: { id: update.id },
        data: {
          content: update.data.content,
          ...(update.data.title ? { title: update.data.title } : {}),
          ...(update.data.description
            ? { description: update.data.description }
            : {})
        }
      })
    )
  );

  console.log(`\nЗаписано страниц: ${updates.length}.`);
};

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => dbClient.$disconnect());
