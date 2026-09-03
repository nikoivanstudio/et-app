import {
  TurnstileValidateResponse,
  validateTurnstileToken
} from 'next-turnstile';

import { serverEnv } from '@/shared/config/env';

const getCfToken = (data: unknown): string | null =>
  (!!data &&
    typeof data === 'object' &&
    'cf-turnstile-response' in data &&
    typeof data['cf-turnstile-response'] === 'string' &&
    data['cf-turnstile-response']) ||
  null;

const safeVerifyHuman = async (
  data: unknown
): Promise<TurnstileValidateResponse> => {
  const token = getCfToken(data);

  const result = token
    ? await validateTurnstileToken({
        token,
        secretKey: serverEnv.turnstileSecret
      })
    : { success: false };

  return result;
};

/**
 * Проверка «человек ли это» (MED-2).
 *
 * Ключевое отличие от прежней версии: вызывающая сторона больше не должна
 * сама решать, применять ли проверку, ориентируясь на NODE_ENV. Решение
 * принимается здесь и опирается на конфигурацию — наличие ключа Turnstile,
 * который в production обязателен.
 *
 * Возвращает true, только если проверка пройдена либо капча в этом окружении
 * не настроена вовсе (локальная разработка).
 */
const verifyHuman = async (data: unknown): Promise<boolean> => {
  if (!serverEnv.isCaptchaEnabled) {
    return true;
  }

  const token = getCfToken(data);

  if (!token) {
    return false;
  }

  const result = await validateTurnstileToken({
    token,
    secretKey: serverEnv.turnstileSecret
  });

  return result.success;
};

/** Проверка токена, переданного отдельным полем, а не всей формой. */
const verifyHumanToken = (token: string | null | undefined): Promise<boolean> =>
  verifyHuman(token ? { 'cf-turnstile-response': token } : {});

export const turnstileService = {
  verifyHuman,
  verifyHumanToken,
  safeVerifyHuman
};
