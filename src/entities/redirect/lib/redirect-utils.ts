/**
 * Нормализация адреса перед поиском правила.
 *
 * Без неё таблица переадресаций не работает на реальных ссылках: с прежнего
 * сайта на WordPress адреса расходились по слэшу на конце
 * (`/mangup-kale` и `/mangup-kale/` — один и тот же материал) и по регистру,
 * а из соцсетей приходят ссылки с utm-метками. Правило заводится один раз,
 * а совпасть должно со всеми тремя вариантами.
 */
export const normalizeRedirectSource = (pathname: string): string => {
  const trimmed = pathname.trim().toLowerCase();
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  if (withLeadingSlash === '/') {
    return '/';
  }

  return withLeadingSlash.replace(/\/+$/, '');
};

/** Допустимые коды: постоянный, временный и «удалено навсегда». */
const ALLOWED_STATUS_CODES = new Set([301, 302, 307, 308, 410]);

export const isRedirectStatusCode = (value: number): boolean =>
  ALLOWED_STATUS_CODES.has(value);

/**
 * Итоговый адрес с сохранённой строкой запроса.
 *
 * Строка запроса переносится на цель осознанно: иначе utm-метки терялись бы
 * на каждом редиректе, и весь входящий трафик из рассылок и ВК сваливался бы
 * в Метрике в «переходы по ссылкам». Если цель уже несёт свои параметры,
 * чужие не приклеиваем: правило заведено осознанно, и его параметры важнее
 * пришедших.
 */
export const buildRedirectTarget = (
  destination: string,
  search: string
): string => {
  if (!search || destination.includes('?')) {
    return destination;
  }

  return `${destination}${search}`;
};
