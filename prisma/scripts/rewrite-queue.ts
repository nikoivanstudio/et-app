/**
 * Очередь рерайта справочника (задача F6).
 *
 * Собирает из базы порядок, в котором 763 страницы переписываются
 * порциями по десять, и раскладывает его по CSV. Порядок не по алфавиту
 * и не по длине: сначала то, с чего заказывают, потом объекты, на которые
 * идут туры, потом известные достопримечательности, и в конце — хвост,
 * который скорее закрывается от индексации, чем переписывается.
 *
 * Приоритет внутри уровня — по доле совпадения с донором
 * (prisma/data/duplicates.csv, его пишет scripts/check-duplicates.ts):
 * дословная копия страницы, на которую идёт трафик, вреднее всего.
 * Без файла замера скрипт работает, но сортирует только по объёму.
 *
 * Запуск:
 *   npx tsx prisma/scripts/rewrite-queue.ts
 *
 * Результат — prisma/data/rewrite-queue.csv. Рядом с redirects.csv, а не
 * в docs/: очередь читает заливка, а она запускается и на проде, куда
 * каталог docs/ не уезжает. Скрипт ничего не пишет в базу.
 */

import 'dotenv/config';

import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { dbClient } from '@/shared/lib/db';

const DUPLICATES = path.join(process.cwd(), 'prisma', 'data', 'duplicates.csv');
const QUEUE = path.join(process.cwd(), 'prisma', 'data', 'rewrite-queue.csv');

/** Размер порции. Договорённость с заказчиком: десять страниц за подход. */
const BATCH = 10;

/** Короче этого страница уходит в хвост независимо от темы. */
const SHORT_WORDS = 250;

type Tier = { key: string; title: string; match: RegExp };

/**
 * Уровни приоритета. Порядок массива — порядок работы.
 *
 * Списки ключевых слов экспертные, а не снятые из Wordstat: частотности
 * появятся в F1, и тогда T3 пересобирается по числам. До тех пор уровень
 * определяется тем, ведёт ли на объект хоть один тур и знает ли объект
 * человек, который в Крыму не был.
 */
const TIERS: Tier[] = [
  {
    key: 'T1',
    title: 'Коммерция: туры и экскурсии',
    match:
      /dzhip-tur|ekskursi|^tury-|-tury$|^tur-|-tur$|dikie-tury|zimnie-tury|otdyh-v-krymu/
  },
  {
    key: 'T2',
    title: 'Объекты, на которые идут туры',
    match:
      /mangup|chufut|eski-kermen|tepe-kermen|kachi-kalon|kachinsk|belbek|chelter|bakla$|kyz-kermen|tik-kuyu|syujren|suren|aj-petri|bolshoj-kanon|bahchisaray|bahchisarajsk|alimova|danilcha|kokkozka|peshhernye-goroda|peshhernyj-gorod|sfinks|hanskij-dvorets|uspenskij-monastyr/
  },
  {
    key: 'T3',
    title: 'Известные достопримечательности',
    match:
      /lastochkino|nikitskij|vorontsovsk|livadijsk|massandrovsk|yusupovsk|hersones|balaklav|demerdzhi|dolina-prividenij|chatyr-dag|mramornaya|emine-bair|krasnaya-peshhera|sudak|genuezsk|novyj-svet|golitsyn|kara-dag|karadag|tarhankut|ayu-dag|uchan-su|dzhur-dzhur|bajdarsk|foros|simeiz|gurzuf|artek|partenit|laspi|chertova-lestnitsa|yalta|alupka|koktebel|evpatoriya|kerch|sevastopol|simferopol|alushta/
  },
  { key: 'T4', title: 'Остальной справочник', match: /.*/ }
];

/** Хвост: узкие темы, которые почти наверняка уходят в noindex. */
const TAIL =
  /^dacha-|^basman|^dinastiya-|-peshhera$|^peshhera-|yajla$|^legenda|legendy|barelef/;

const normalizeTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/ /g, ' ')
    .replace(/[«»"'`.,:;!?()\[\]—–-]/g, ' ')
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim();

const readDuplicates = async (): Promise<
  Map<string, { pct: number; src: string }>
> => {
  const map = new Map<string, { pct: number; src: string }>();

  if (!existsSync(DUPLICATES)) {
    console.warn(
      `Файла ${path.relative(process.cwd(), DUPLICATES)} нет — сортировка только по объёму.\n` +
        'Замер: npx tsx scripts/check-duplicates.ts\n'
    );

    return map;
  }

  const [, ...lines] = (await readFile(DUPLICATES, 'utf8')).trim().split('\n');

  for (const line of lines) {
    const [slug, , pct, , src] = line.split(',');

    map.set(slug, { pct: Number(pct), src: src ?? '' });
  }

  return map;
};

/** Порядок слагов из уже собранной очереди, если она есть. */
const readOrder = async (): Promise<string[]> => {
  if (!existsSync(QUEUE)) {
    return [];
  }

  const [, ...lines] = (await readFile(QUEUE, 'utf8')).trim().split('\n');

  return lines.map(line => line.split(',')[2]).filter(Boolean);
};

const main = async () => {
  const duplicates = await readDuplicates();

  const posts = await dbClient.post.findMany({
    select: { id: true, slug: true, title: true, content: true },
    orderBy: { slug: 'asc' }
  });

  // Группы дублей из B6: у страниц с одинаковым заголовком переписывать
  // надо победителя, остальные уходят в 301 после слияния текстов.
  const byTitle = new Map<string, typeof posts>();

  for (const post of posts) {
    const key = normalizeTitle(post.title);

    byTitle.set(key, [...(byTitle.get(key) ?? []), post]);
  }

  const merged = new Set<number>();

  for (const group of byTitle.values()) {
    if (group.length < 2) {
      continue;
    }

    const [, ...losers] = [...group].sort(
      (a, b) => (b.content?.length ?? 0) - (a.content?.length ?? 0)
    );

    losers.forEach(post => merged.add(post.id));
  }

  const rows = posts.map(post => {
    const words = (post.content ?? '')
      .replace(/<[^>]+>/g, ' ')
      .split(/\s+/)
      .filter(Boolean).length;
    const duplicate = duplicates.get(post.slug);
    const tier = merged.has(post.id)
      ? 'T6'
      : TAIL.test(post.slug) || words < SHORT_WORDS
        ? 'T5'
        : (TIERS.find(item => item.match.test(post.slug)) as Tier).key;

    return {
      slug: post.slug,
      title: post.title
        .replace(/[\r\n]+/g, ' ')
        .replace(/"/g, '""')
        .trim(),
      words,
      tier,
      pct: duplicate?.pct ?? 0,
      src: duplicate?.src ?? ''
    };
  });

  const order = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

  rows.sort(
    (a, b) =>
      order.indexOf(a.tier) - order.indexOf(b.tier) ||
      b.pct - a.pct ||
      b.words - a.words
  );

  // Порядок страниц, уже стоявших в очереди, сохраняется.
  //
  // Иначе пересборка после залитой порции перетасовывала бы номера:
  // у переписанной страницы доля совпадения падает до нуля, она
  // проваливается в конец своего уровня и тянет за собой остальные.
  // «Порция 3» тогда означала бы разное до и после работы, а именно
  // по номеру порция и заказывается.
  const previous = await readOrder();

  if (previous.length) {
    const known = new Map(previous.map((slug, index) => [slug, index]));
    const fresh = rows.filter(row => !known.has(row.slug)).length;

    rows.sort(
      (a, b) =>
        (known.get(a.slug) ?? Infinity) - (known.get(b.slug) ?? Infinity)
    );

    console.log(
      `Очередь уже была: порядок ${previous.length} страниц сохранён` +
        (fresh ? `, новых в хвост: ${fresh}` : '')
    );
  }

  await writeFile(
    QUEUE,
    ['batch,tier,slug,words,dup_pct,title,src']
      .concat(
        rows.map(
          (row, index) =>
            `${Math.floor(index / BATCH) + 1},${row.tier},${row.slug},${row.words},${row.pct},"${row.title}",${row.src}`
        )
      )
      .join('\n') + '\n'
  );

  const labels: Record<string, string> = {
    ...Object.fromEntries(TIERS.map(tier => [tier.key, tier.title])),
    T5: 'Хвост: короткие и узкие темы',
    T6: 'Непобедившие страницы групп дублей (сначала B6)'
  };

  console.log(
    `Страниц в очереди: ${rows.length}, порций по ${BATCH}: ${Math.ceil(rows.length / BATCH)}\n`
  );

  for (const tier of order) {
    const group = rows.filter(row => row.tier === tier);

    if (!group.length) {
      continue;
    }

    const first = rows.findIndex(row => row.tier === tier);
    const copies = group.filter(row => row.pct >= 50).length;

    console.log(
      `${tier}. ${labels[tier]}: ${group.length} стр., ` +
        `порции ${Math.floor(first / BATCH) + 1}–${Math.floor((first + group.length - 1) / BATCH) + 1}` +
        (duplicates.size ? `, копий (≥50%): ${copies}` : '')
    );
  }

  console.log(`\nОчередь: ${path.relative(process.cwd(), QUEUE)}`);
};

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => dbClient.$disconnect());
