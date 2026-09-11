/**
 * Внешние источники картинок — одним списком.
 *
 * Читается из двух мест: `next.config.ts` (`images.remotePatterns`, то есть
 * что вообще разрешено оптимизатору) и `shared/lib/content-images.ts`
 * (что можно переписывать на `/_next/image` внутри текста статьи).
 *
 * Списки обязаны совпадать: адрес, который прошёл переписывание, но не
 * попал в `remotePatterns`, отвечает 400, и картинка на странице просто
 * исчезает. Разъезжаются такие списки молча, поэтому он здесь один.
 */
export const REMOTE_IMAGE_SOURCES = [
  { hostname: 'okryme.ru', pathPrefix: '/wp-content/' },
  { hostname: 'energy-tur.ru', pathPrefix: '/wp-content/' }
] as const;

/**
 * Можно ли отдать этот адрес оптимизатору next/image.
 *
 * Локальные пути (`/api/files/content/...`, `/images/...`) разрешены: это
 * тот же origin. Всё остальное — только из списка выше.
 */
export const isOptimizableImageSource = (src: string): boolean => {
  if (src.startsWith('/') && !src.startsWith('//')) {
    return true;
  }

  try {
    const url = new URL(src);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return false;
    }

    return REMOTE_IMAGE_SOURCES.some(
      source =>
        url.hostname === source.hostname &&
        url.pathname.startsWith(source.pathPrefix)
    );
  } catch {
    return false;
  }
};
