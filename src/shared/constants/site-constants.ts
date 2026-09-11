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

/**
 * Логотип: путь, по которому он отдаётся, и его собственные размеры.
 *
 * Файл лежит в `public/`, а не импортом модуля в `shared/assets`, из-за
 * схемы организации (C1). Импорт даёт хешированный путь вида
 * `/_next/static/media/logo.a1b2c3.png` — он меняется при каждой пересборке,
 * а `logo` в разметке должен быть постоянным адресом: по нему поисковик
 * забирает картинку для карточки организации и панели знаний.
 *
 * Размеры — родные, 204×228. Компоненты выводят логотип мельче и задают
 * свои `width`/`height`; здесь они нужны схеме, чтобы отдать `ImageObject`
 * с пропорциями, а не голый URL.
 */
export const SITE_LOGO = {
  path: '/logo.png',
  width: 204,
  height: 228
} as const;
