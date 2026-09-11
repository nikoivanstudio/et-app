/**
 * Описание страницы для мета-тегов.
 *
 * Зачем этот модуль вообще нужен: при импорте из WordPress у постов в поле
 * `description` записывалась строка-заглушка `'description'` (см.
 * `features/post/constants/legacy-contansts.ts`). В выборке из 50 страниц
 * заглушка нашлась у 46 — то есть примерно на восьмистах страницах сайта
 * и в `<meta name="description">`, и в `og:description`. Поисковик в таком
 * случае собирает сниппет сам, а превью ссылки в Telegram и VK показывает
 * слово «description».
 *
 * Чинить только данные недостаточно: любая новая запись без заполненного
 * описания вернула бы ту же проблему. Поэтому фолбэк живёт в коде, а
 * бэкфилл базы (`prisma/scripts/backfill-descriptions.ts`) — разовая
 * операция поверх него.
 */

/** Рекомендуемая длина описания: дальше Яндекс и Google обрезают сниппет. */
export const DESCRIPTION_MAX_LENGTH = 160;

/**
 * Значения, которые технически непустые, но описанием не являются.
 * Сравнение регистронезависимое и по обрезанной строке.
 */
const PLACEHOLDERS = new Set([
  'description',
  'descriptions',
  'meta description',
  'описание',
  'заголовок страницы',
  'lorem ipsum'
]);

const isPlaceholder = (value: string): boolean =>
  PLACEHOLDERS.has(value.trim().toLowerCase());

/** Именованные сущности, реально встречающиеся в перенесённых текстах. */
const ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&thinsp;': ' ',
  '&amp;': '&',
  '&quot;': '"',
  '&apos;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&laquo;': '«',
  '&raquo;': '»',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…'
};

const decodeEntities = (value: string): string =>
  value
    .replace(
      /&(?:nbsp|thinsp|amp|quot|apos|lt|gt|laquo|raquo|mdash|ndash|hellip);/g,
      entity => ENTITIES[entity] ?? entity
    )
    // Из совпадения берём цифры срезом, а не группой: конфиг eslint
    // запрещает неиспользуемые аргументы, а первый параметр колбэка
    // (полное совпадение) здесь был бы лишним.
    .replace(/&#\d+;/g, match =>
      String.fromCodePoint(Number(match.slice(2, -1)))
    );

/**
 * Текст из HTML-контента поста.
 *
 * Содержимое легаси-постов лежит одной строкой с тегами и сущностями —
 * его нельзя отдавать в мета-тег как есть.
 */
export const getPlainText = (html: string): string =>
  decodeEntities(
    html
      // Скрипты и стили выкидываем вместе с содержимым, остальные теги —
      // только разметку, заменяя пробелом, чтобы слова не слипались.
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Обрезка по границе слова.
 *
 * Обрезать посередине слова нельзя: такой сниппет читается как оборванный.
 * Если ближайшего пробела нет (длинное слово в начале) — режем жёстко,
 * иначе вернули бы пустую строку.
 */
export const truncate = (
  value: string,
  limit: number = DESCRIPTION_MAX_LENGTH
): string => {
  if (value.length <= limit) {
    return value;
  }

  const head = value.slice(0, limit + 1);
  const lastSpace = head.lastIndexOf(' ');
  const cut =
    lastSpace > limit / 2 ? head.slice(0, lastSpace) : head.slice(0, limit);

  return `${cut.replace(/[\s,.;:—–-]+$/, '')}…`;
};

/**
 * Итоговое описание страницы.
 *
 * Порядок: заполненное вручную описание → текст из контента → пустая строка.
 * Пустую строку вызывающий код обязан трактовать как «мета-тега нет»:
 * пустой `content=""` для поисковика хуже отсутствующего тега.
 */
export const buildDescription = (
  explicit: string | null | undefined,
  content?: string | null
): string => {
  const candidate = (explicit ?? '').trim();

  if (candidate && !isPlaceholder(candidate)) {
    return truncate(candidate, 320);
  }

  const fromContent = getPlainText(content ?? '');

  if (!fromContent || isPlaceholder(fromContent)) {
    return '';
  }

  return truncate(fromContent);
};
