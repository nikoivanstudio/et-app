/**
 * Метаданные публичных страниц (задача H1).
 *
 * Тестов на метаданные не было ни одного, и цена этого известна: поле
 * `description` со строкой-заглушкой `'description'` прожило на восьмистах
 * страницах сайта несколько лет и сломало превью ссылок в Telegram, VK и
 * WhatsApp — в основных каналах проекта. Заглушку убрали (B1), но ничто
 * не мешает ей вернуться через полгода вместе с новой страницей.
 *
 * Тест ходит по файловой системе и находит ВСЕ статические публичные
 * маршруты сам. Это принципиально: список, который надо дополнять руками,
 * перестаёт пополняться на третьей неделе, и новая страница ровно так же
 * приезжает без описания.
 *
 * @jest-environment node
 */
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';

const PUBLIC_DIR = join(process.cwd(), 'src/app/(public)');

/** Максимальная длина описания: дальше Яндекс и Google обрезают сниппет. */
const DESCRIPTION_MAX = 170;

/** Заголовок длиннее этого в выдаче не помещается. */
const TITLE_MAX = 70;

/** Значения, которые технически непустые, но описанием не являются. */
const PLACEHOLDERS = new Set([
  'description',
  'описание',
  'заголовок страницы',
  'title',
  'туры'
]);

type Route = {
  /** Адрес от корня: '/tours', '/uslugi/prokat-palatki-v-krymu'. */
  path: string;
  /** Путь к файлу layout.tsx для импорта. */
  file: string;
};

/**
 * Статические маршруты внутри `(public)`.
 *
 * Сегменты в скобках пропускаются двояко: `[slug]` — это динамический
 * маршрут, его метаданные зависят от записи в базе и проверяются
 * отдельными тестами сервисов; `(group)` — группа маршрутов, которая
 * в адрес не входит.
 */
const collectRoutes = (dir: string, prefix = ''): Route[] => {
  const routes: Route[] = [];

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (!statSync(full).isDirectory()) {
      continue;
    }

    if (entry.startsWith('[')) {
      continue;
    }

    const segment = entry.startsWith('(') ? '' : `/${entry}`;
    const path = `${prefix}${segment}`;

    if (readdirSync(full).includes('layout.tsx')) {
      routes.push({ path: path || '/', file: join(full, 'layout.tsx') });
    }

    routes.push(...collectRoutes(full, path));
  }

  return routes;
};

const routes = collectRoutes(PUBLIC_DIR);

const loadMetadata = async (route: Route): Promise<Metadata> => {
  const module_ = await import(route.file);

  if (typeof module_.generateMetadata === 'function') {
    // Сегменты без параметров всё равно получают params: Next передаёт
    // пустой объект, и подписи должны совпадать.
    return module_.generateMetadata({ params: Promise.resolve({}) });
  }

  return module_.metadata as Metadata;
};

const getCanonical = (metadata: Metadata): string | undefined => {
  const canonical = metadata.alternates?.canonical;

  if (typeof canonical === 'string') {
    return canonical;
  }

  return typeof canonical === 'object' && canonical && 'url' in canonical
    ? String(canonical.url)
    : undefined;
};

const getTitle = (metadata: Metadata): string =>
  typeof metadata.title === 'string' ? metadata.title : '';

const getDescription = (metadata: Metadata): string =>
  typeof metadata.description === 'string' ? metadata.description : '';

const isNoindex = (metadata: Metadata): boolean =>
  typeof metadata.robots === 'object' &&
  metadata.robots !== null &&
  'index' in metadata.robots &&
  metadata.robots.index === false;

describe('метаданные публичных страниц', () => {
  test('маршруты вообще нашлись', () => {
    // Если обход сломается, все тесты ниже станут зелёными на пустом
    // списке — и мы этого не заметим.
    expect(routes.length).toBeGreaterThan(15);
  });

  test.each(routes.map(route => [route.path, route] as const))(
    '%s: заголовок и описание на месте',
    async (path, route) => {
      // `path` участвует только в имени теста — его подставляет
      // сам test.each; здесь он нужен, чтобы подписи совпали.
      void path;

      const metadata = await loadMetadata(route);
      const title = getTitle(metadata);
      const description = getDescription(metadata);

      expect(title).not.toBe('');
      expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
      expect(PLACEHOLDERS.has(title.trim().toLowerCase())).toBe(false);

      expect(description).not.toBe('');
      expect(PLACEHOLDERS.has(description.trim().toLowerCase())).toBe(false);
      expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);

      // Описание, повторяющее заголовок слово в слово, поисковик
      // отбрасывает и собирает сниппет сам — так было у /dzhip-tur-krym
      // и /tury до B7.
      expect(description.trim()).not.toBe(title.trim());
    }
  );

  test.each(routes.map(route => [route.path, route] as const))(
    '%s: канонический адрес совпадает с маршрутом',
    async (path, route) => {
      const metadata = await loadMetadata(route);

      // Относительный путь — намеренно: Next разворачивает его по
      // metadataBase. Проверяем именно совпадение с адресом сегмента,
      // потому что унаследованный canonical родителя объявлял бы
      // страницу копией чужой — ровно это и делал `canonical: '/'`
      // в корневом layout.
      expect(getCanonical(metadata)).toBe(path);
    }
  );

  test('заголовки не повторяются', async () => {
    const metadataList = await Promise.all(routes.map(loadMetadata));

    const titles = metadataList
      .filter(metadata => !isNoindex(metadata))
      .map(metadata => getTitle(metadata).trim());

    const duplicates = titles.filter(
      (title, index) => titles.indexOf(title) !== index
    );

    expect(duplicates).toEqual([]);
  });

  test('описания не повторяются', async () => {
    const metadataList = await Promise.all(routes.map(loadMetadata));

    const descriptions = metadataList
      .filter(metadata => !isNoindex(metadata))
      .map(metadata => getDescription(metadata).trim());

    const duplicates = descriptions.filter(
      (description, index) => descriptions.indexOf(description) !== index
    );

    expect(duplicates).toEqual([]);
  });

  test('открытая для индексации страница несёт og:image', async () => {
    // og:image приходится задавать вручную: сегмент, объявивший свой
    // openGraph, затирает openGraph родителя целиком — вместе с картинкой
    // из файловой конвенции. Без явной ссылки она осталась бы у главной.
    const metadataList = await Promise.all(routes.map(loadMetadata));

    metadataList
      .filter(metadata => !isNoindex(metadata))
      .forEach(metadata => {
        expect(metadata.openGraph?.images).toBeDefined();
      });
  });
});
