import { isOptimizableImageSource } from '@/shared/config/image-sources';

/**
 * Картинки внутри текста статьи (задача D2).
 *
 * Снять `images.unoptimized` было мало. Тексты постов рендерятся сырым
 * HTML через `TextContent`, и теги `<img>` внутри идут мимо `next/image`
 * в любом случае: оптимизируется только то, что прошло через компонент.
 * А внутри контента лежит основная масса фотографий справочника — прямо
 * с `energy-tur.ru/wp-content/`, оригиналами. На карточке Чуфут-Кале одна
 * такая картинка весит 449 КБ при показе в 639 пикселей.
 *
 * Что делает процессор:
 *
 * 1. Переписывает `src` на `/_next/image` — ресайз, WebP/AVIF и кеш;
 * 2. проставляет `srcset` и `sizes`, чтобы телефон не тянул версию
 *    для десктопа;
 * 3. добавляет `width`/`height` там, где размер удаётся узнать, — против
 *    сдвигов вёрстки: картинка без размеров раздвигает текст в момент
 *    загрузки, и это прямой вклад в CLS;
 * 4. ставит `loading="lazy"` и `decoding="async"` — в статьях справочника
 *    по десятку картинок, и все они грузились сразу.
 *
 * Работает на строке, а не на DOM: контент проходит через санитайзер
 * (`sanitizeArticleHtml`), который уже разобрал и пересобрал разметку по
 * allowlist, так что на вход сюда приходит предсказуемый HTML. Тянуть
 * ради дописывания атрибутов второй парсер — лишние 300 КБ в серверном
 * бандле на каждой странице.
 */

/** Ширины из `deviceSizes` по умолчанию: другие значения оптимизатор отвергает. */
const SRCSET_WIDTHS = [640, 828, 1080] as const;

/** Колонка текста — 720px, плюс запас на плотные экраны. */
const DEFAULT_SIZES = '(max-width: 768px) 100vw, 720px';

const QUALITY = 75;

const buildOptimizedUrl = (src: string, width: number): string =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${QUALITY}`;

/**
 * Размеры из имени файла WordPress: `Photo_jeep-300x116.png`.
 *
 * WordPress дописывает размер миниатюры в имя, и это единственный источник
 * пропорций, доступный без запроса самой картинки. Запрашивать её на
 * рендере нельзя: это сотни HTTP-запросов на страницу справочника.
 */
const parseSizeFromFilename = (
  src: string
): { width: number; height: number } | null => {
  const match = /-(\d{2,4})x(\d{2,4})\.(?:jpe?g|png|webp|gif)/i.exec(src);

  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);

  return width > 0 && height > 0 ? { width, height } : null;
};

/** Значение атрибута в теге: `src="…"` или `src='…'`. */
const getAttribute = (tag: string, name: string): string | null => {
  const match = new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, 'i').exec(tag);

  return match ? match[2] : null;
};

const hasAttribute = (tag: string, name: string): boolean =>
  new RegExp(`\\s${name}\\s*=`, 'i').test(tag);

/** Дописывает атрибут перед закрывающей скобкой тега. */
const withAttributes = (tag: string, attributes: string[]): string => {
  if (!attributes.length) {
    return tag;
  }

  const closing = tag.endsWith('/>') ? '/>' : '>';
  const body = tag.slice(0, tag.length - closing.length).trimEnd();

  return `${body} ${attributes.join(' ')}${closing}`;
};

const escapeAttribute = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const processImgTag = (tag: string): string => {
  const src = getAttribute(tag, 'src');

  if (!src) {
    return tag;
  }

  const attributes: string[] = [];
  let result = tag;

  // Размеры ставим всегда, когда знаем: против сдвига вёрстки они нужны
  // и неоптимизированной картинке тоже.
  const size = parseSizeFromFilename(src);

  if (size && !hasAttribute(tag, 'width') && !hasAttribute(tag, 'height')) {
    attributes.push(`width="${size.width}"`, `height="${size.height}"`);
  }

  if (!hasAttribute(tag, 'loading')) {
    attributes.push('loading="lazy"');
  }

  if (!hasAttribute(tag, 'decoding')) {
    attributes.push('decoding="async"');
  }

  // Переписываем только то, что оптимизатор примет. Чужой хост, отдельно
  // не разрешённый в `remotePatterns`, ответил бы 400 — картинка просто
  // исчезла бы со страницы.
  if (isOptimizableImageSource(src)) {
    const srcset = SRCSET_WIDTHS.map(
      width => `${escapeAttribute(buildOptimizedUrl(src, width))} ${width}w`
    ).join(', ');

    result = result.replace(
      /\ssrc\s*=\s*(["'])(.*?)\1/i,
      ` src="${escapeAttribute(buildOptimizedUrl(src, SRCSET_WIDTHS[SRCSET_WIDTHS.length - 1]))}"`
    );

    // Прежний srcset (у WordPress он ссылается на его же миниатюры)
    // заменяем целиком: оставить его значило бы отдать браузеру выбор
    // между оптимизированной и неоптимизированной версией.
    result = result.replace(/\ssrcset\s*=\s*(["'])(.*?)\1/i, '');
    result = result.replace(/\ssizes\s*=\s*(["'])(.*?)\1/i, '');

    attributes.push(`srcset="${srcset}"`, `sizes="${DEFAULT_SIZES}"`);
  }

  return withAttributes(result, attributes);
};

/**
 * Обрабатывает все `<img>` в готовом HTML.
 *
 * Вызывать ПОСЛЕ санитизации: до неё в строке может быть что угодно,
 * включая теги внутри атрибутов, и регулярное выражение по такому входу
 * ненадёжно.
 */
export const optimizeContentImages = (html: string): string =>
  html.replace(/<img\b[^>]*>/gi, processImgTag);
