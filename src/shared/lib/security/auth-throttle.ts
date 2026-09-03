import 'server-only';

import { headers } from 'next/headers';

import { getClientIp } from '@/shared/lib/security/client-ip';
import { checkRateLimitInMemory } from '@/shared/lib/security/rate-limit-memory';

/**
 * Ограничение попыток входа (HIGH-1).
 *
 * Вход, регистрация и смена пароля реализованы как server actions — это POST
 * на адрес самой страницы. Прежний matcher middleware (`/api/:path*`) их
 * не покрывал, поэтому подбор пароля не сдерживался ничем.
 *
 * Здесь два независимых счётчика:
 *  - по паре IP + логин — против подбора пароля к конкретной учётной записи;
 *  - по IP — против перебора самих логинов и кодов подтверждения.
 *
 * Счётчики живут в памяти процесса. Этого достаточно для одного экземпляра
 * приложения; при горизонтальном масштабировании их следует перенести
 * в общее хранилище (см. примечание к HIGH-3).
 */

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_PER_ACCOUNT = 5;
const LOGIN_MAX_PER_IP = 20;

export type ThrottleResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const buildResult = (
  isLimited: boolean,
  resetAt: Date
): ThrottleResult => ({
  allowed: !isLimited,
  retryAfterSeconds: Math.max(
    1,
    Math.ceil((resetAt.getTime() - Date.now()) / 1000)
  )
});

const getIp = async (): Promise<string> => {
  const headerStore = await headers();

  return getClientIp(name => headerStore.get(name));
};

/**
 * Расходует попытку. Вызывать ДО проверки пароля, чтобы неудачные попытки
 * учитывались независимо от результата.
 */
export const consumeAuthAttempt = async (
  action: string,
  identifier?: string
): Promise<ThrottleResult> => {
  const ip = await getIp();

  const perIp = checkRateLimitInMemory({
    key: `auth:${action}:ip:${ip}`,
    windowMs: LOGIN_WINDOW_MS,
    maxRequests: LOGIN_MAX_PER_IP
  });

  if (perIp.isLimited) {
    return buildResult(true, perIp.resetAt);
  }

  if (!identifier) {
    return buildResult(false, perIp.resetAt);
  }

  const perAccount = checkRateLimitInMemory({
    key: `auth:${action}:acc:${ip}:${identifier.toLowerCase()}`,
    windowMs: LOGIN_WINDOW_MS,
    maxRequests: LOGIN_MAX_PER_ACCOUNT
  });

  return buildResult(perAccount.isLimited, perAccount.resetAt);
};

export const authThrottleMessage = (result: ThrottleResult): string =>
  `Слишком много попыток. Повторите через ${Math.ceil(
    result.retryAfterSeconds / 60
  )} мин.`;
