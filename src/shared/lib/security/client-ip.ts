import { serverEnv } from '@/shared/config/env';

/**
 * Определение IP клиента (HIGH-3).
 *
 * Было: `x-forwarded-for?.split(',')[0]` — то есть брался ПЕРВЫЙ элемент
 * списка. Этот элемент полностью подконтролен клиенту: достаточно послать
 * `X-Forwarded-For: <случайный адрес>`, и каждый запрос попадал в новое ведро
 * счётчика, обнуляя любые ограничения.
 *
 * Стало: доверяем только тем элементам, которые дописали наши собственные
 * прокси. XFF формируется слева направо, поэтому адрес, добавленный ближайшим
 * доверенным прокси, находится с конца — на позиции
 * `длина - TRUSTED_PROXY_COUNT`. Приоритет отдаётся `x-real-ip`, который nginx
 * перезаписывает своим значением.
 *
 * Требуется в конфигурации nginx:
 *   proxy_set_header X-Real-IP $remote_addr;
 *   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 *
 * Если приложение стоит за дополнительным прокси (например, CDN), укажите
 * их количество в переменной TRUSTED_PROXY_COUNT.
 */
export const UNKNOWN_IP = 'unknown';

type HeaderGetter = (name: string) => string | null | undefined;

export const getClientIp = (getHeader: HeaderGetter): string => {
  const realIp = getHeader('x-real-ip')?.trim();

  if (realIp) {
    return realIp;
  }

  const forwarded = getHeader('x-forwarded-for');

  if (!forwarded) {
    return UNKNOWN_IP;
  }

  const chain = forwarded
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);

  if (chain.length === 0) {
    return UNKNOWN_IP;
  }

  const trustedCount = Math.max(serverEnv.trustedProxyCount, 1);
  const index = chain.length - trustedCount;

  // При index < 0 клиент прислал меньше элементов, чем ожидается от наших
  // прокси, — значение недостоверно, берём самый правый элемент.
  return index >= 0 ? chain[index] : chain[chain.length - 1];
};
