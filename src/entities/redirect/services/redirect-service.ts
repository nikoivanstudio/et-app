import { normalizeRedirectSource } from '@/entities/redirect/lib/redirect-utils';
import {
  redirectRepositories,
  type RedirectRule
} from '@/entities/redirect/repositories/redirect';

/**
 * Правила переадресации для прокси.
 *
 * Нормализация адреса-источника повторяется на чтении, а не только на
 * записи: правила заводятся скриптом из CSV, который правят руками, и
 * один адрес со слэшем на конце не должен молча выпадать из работы.
 *
 * Самоссылки отбрасываются здесь же: правило `A → A` даёт бесконечный
 * цикл редиректов, а браузер показывает `ERR_TOO_MANY_REDIRECTS` вместо
 * страницы. Опечатка в CSV не должна стоить раздела сайта.
 */
const getRedirectRules = async (): Promise<RedirectRule[]> => {
  const rules = await redirectRepositories.getActiveRedirects();

  return rules
    .map(rule => ({ ...rule, source: normalizeRedirectSource(rule.source) }))
    .filter(rule => rule.source !== rule.destination);
};

export const redirectService = { getRedirectRules };
