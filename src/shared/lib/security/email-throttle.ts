import { checkRateLimitInMemory } from '@/shared/lib/security/rate-limit-memory';

/**
 * Ограничение отправки писем по адресу получателя (MED-8).
 *
 * Лимит в middleware считается по IP и пути, поэтому он не мешает отправить
 * много писем на ОДИН адрес из разных сетей. Здесь добавляется независимый
 * счётчик на сам адрес — он ограничивает возможность засыпать письмами
 * конкретного человека и расходовать квоту Resend.
 */
const EMAIL_WINDOW_MS = 60 * 60 * 1000;
const EMAIL_MAX_PER_HOUR = 5;

export type EmailQuotaResult = {
  allowed: boolean;
  retryAfterMinutes: number;
};

export const consumeEmailQuota = (
  scope: string,
  recipient: string
): EmailQuotaResult => {
  const { isLimited, resetAt } = checkRateLimitInMemory({
    key: `mail:${scope}:${recipient.trim().toLowerCase()}`,
    windowMs: EMAIL_WINDOW_MS,
    maxRequests: EMAIL_MAX_PER_HOUR
  });

  return {
    allowed: !isLimited,
    retryAfterMinutes: Math.max(
      1,
      Math.ceil((resetAt.getTime() - Date.now()) / 60_000)
    )
  };
};
