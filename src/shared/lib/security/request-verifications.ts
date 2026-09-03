import { NextRequest } from 'next/server';

import { getClientIp } from '@/shared/lib/security/client-ip';
import {
  ALLOWED_ORIGINS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  SAFE_HTTP_METHODS
} from '@/shared/lib/security/constants';
import { checkRateLimitInMemory } from '@/shared/lib/security/rate-limit-memory';
import {
  SecurityLimitException,
  SecurityOriginException
} from '@/shared/lib/security/security-exception';

type LimitOptions = {
  maxRequests?: number;
  windowMs?: number;
  scope?: string;
};

export const verifyLimit = (
  req: NextRequest,
  options: LimitOptions = {}
): { remaining: number; resetAt: Date } => {
  const {
    maxRequests = RATE_LIMIT_MAX,
    windowMs = RATE_LIMIT_WINDOW_MS,
    scope = 'default'
  } = options;

  // HIGH-3: IP берётся из доверенного источника, а не из первого элемента
  // подконтрольного клиенту заголовка X-Forwarded-For
  const ip = getClientIp(name => req.headers.get(name));

  const key = `${scope}:ip:${ip}:${req.nextUrl.pathname}`;

  const { isLimited, remaining, resetAt } = checkRateLimitInMemory({
    key,
    windowMs,
    maxRequests
  });

  if (isLimited) {
    throw new SecurityLimitException('Too many requests');
  }

  return { remaining, resetAt };
};

/**
 * Проверка источника запроса (CRIT-3).
 *
 * Было: обязательный заголовок `X-API-KEY`, сверявшийся с серверной переменной.
 * Клиент брал его из `NEXT_PUBLIC_X_API_KEY`, то есть значение попадало
 * в JavaScript-бандл и было доступно любому — барьера не существовало.
 *
 * Стало: проверка Origin (с запасным вариантом по Referer) только для методов,
 * изменяющих состояние. Для безопасных методов проверка не нужна: браузер
 * при `SameSite=Lax` не отправит cookie сессии в кросс-сайтовом подзапросе,
 * поэтому чужая страница не сможет прочитать данные от имени пользователя.
 */
export const verifyOrigin = (req: NextRequest): string | null => {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  if (SAFE_HTTP_METHODS.includes(req.method)) {
    return origin;
  }

  const isAllowedOrigin = origin !== null && ALLOWED_ORIGINS.includes(origin);

  // Часть клиентов не присылает Origin; тогда опираемся на Referer
  const isAllowedReferer =
    origin === null &&
    referer !== null &&
    ALLOWED_ORIGINS.some(allowed => referer.startsWith(`${allowed}/`));

  if (!isAllowedOrigin && !isAllowedReferer) {
    throw new SecurityOriginException('Origin not allowed');
  }

  return origin;
};
