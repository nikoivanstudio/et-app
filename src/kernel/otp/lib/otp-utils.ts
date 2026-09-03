import { randomInt } from 'node:crypto';

/** Время жизни кода подтверждения, секунды. */
const EXPIRED_TIME = 300;

/** Сколько раз можно ошибиться в коде, прежде чем запись станет непригодной. */
const MAX_ATTEMPTS = 5;

const CODE_LENGTH = 6;

/**
 * Код подтверждения (CRIT-2).
 *
 * Было: `String(Math.ceil(Math.random() * 10000))` — от одного до четырёх
 * знаков из генератора, не предназначенного для криптографии. Всё пространство
 * (10 000 вариантов) перебиралось за минуты.
 *
 * Стало: ровно шесть знаков из криптографического источника, то есть
 * 1 000 000 вариантов, и на запись действует лимит попыток.
 */
const generateOtpCode = (): string =>
  String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, '0');

const isOtpExpired = (date: Date): boolean => {
  const now = Date.now();
  const timeStamp = new Date(date).getTime();

  return (now - timeStamp) / 1000 > EXPIRED_TIME;
};

const isAttemptsExceeded = (attempts: number): boolean =>
  attempts >= MAX_ATTEMPTS;

export const otpUtils = {
  generateOtpCode,
  isOtpExpired,
  isAttemptsExceeded,
  EXPIRED_TIME,
  MAX_ATTEMPTS
};
