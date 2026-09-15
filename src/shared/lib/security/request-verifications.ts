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
/**
 * Собственный адрес приложения по заголовкам запроса.
 *
 * Нужен рядом со списком доменов: проверка источника до этой правки
 * не работала вовсе (см. `PROTECTED_API_PREFIX`), и включать её, опираясь
 * только на жёсткий список, значит поставить работу форм в зависимость
 * от того, не забыли ли туда дописать домен — включая `www.` и адрес
 * предпросмотра. Подделать заголовок может кто угодно, но смысла в этом
 * нет: защита здесь именно от чужой страницы в браузере, а браузер
 * проставляет `Origin` сам и подменить его скриптом не даёт.
 */
const getSelfOrigin = (req: NextRequest): string | null => {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');

  if (!host) return null;

  const protocol =
    req.headers.get('x-forwarded-proto') ??
    req.nextUrl.protocol.replace(':', '');

  return `${protocol}://${host}`;
};

export const verifyOrigin = (req: NextRequest): string | null => {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  if (SAFE_HTTP_METHODS.includes(req.method)) {
    return origin;
  }

  const allowed = [...ALLOWED_ORIGINS, getSelfOrigin(req)].filter(
    (value): value is string => !!value
  );

  const isAllowedOrigin = origin !== null && allowed.includes(origin);

  // Часть клиентов не присылает Origin; тогда опираемся на Referer
  const isAllowedReferer =
    origin === null &&
    referer !== null &&
    allowed.some(value => referer.startsWith(`${value}/`));

  if (!isAllowedOrigin && !isAllowedReferer) {
    throw new SecurityOriginException('Origin not allowed');
  }

  return origin;
};
