/**
 * Единая точка правды по адресу и имени сайта.
 *
 * До этого домен был захардкожен независимо в трёх местах: `metadataBase`
 * корневого layout, `sitemap` в robots.ts и `baseUrl` в sitemap-urls.ts.
 * Расхождение любого из них ломает либо канонические ссылки, либо sitemap.
 */
export const SITE_URL = 'https://energy-tur.ru';

export const SITE_NAME = 'Energy Tour';

export const SITE_LOCALE = 'ru_RU';

/**
 * Абсолютный URL для sitemap — относительные пути там недопустимы.
 *
 * Склейка сделана вручную, а не через `new URL`, чтобы адрес совпадал с тем,
 * что Next выдаёт в `<link rel="canonical">` для того же пути: у корня Next
 * резолвит '/' в домен БЕЗ слэша на конце, а `new URL('/', base)` — со слэшем.
 * Расхождение читалось бы поисковиком как два разных адреса.
 */
export const absoluteUrl = (path: string): string => {
  if (path === '/') {
    return SITE_URL;
  }

  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
