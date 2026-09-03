import 'server-only';

/**
 * Проверка обязательных переменных окружения при старте.
 *
 * Раньше отсутствующий SESSION_SECRET приводил к подписи сессий пустым ключом,
 * то есть проверка подписи фактически перестала бы защищать (HIGH-7).
 * Теперь приложение падает при старте с понятным сообщением.
 */
const requireEnv = (name: string, minLength = 1): string => {
  const value = process.env[name];

  if (!value || value.length < minLength) {
    throw new Error(
      `Переменная окружения ${name} не задана или короче ${minLength} символов. ` +
        `Приложение остановлено, чтобы не работать с ослабленной защитой.`
    );
  }

  return value;
};

const MIN_SECRET_LENGTH = 32;

const isProduction = process.env.NODE_ENV === 'production';

export const serverEnv = {
  /** Ключ подписи JWT сессии. Минимум 32 символа. */
  get sessionSecret(): string {
    return requireEnv('SESSION_SECRET', MIN_SECRET_LENGTH);
  },
  get isProduction(): boolean {
    return isProduction;
  },
  /**
   * Количество доверенных обратных прокси перед приложением.
   * Используется для определения реального IP клиента (HIGH-3).
   */
  get trustedProxyCount(): number {
    const parsed = Number(process.env.TRUSTED_PROXY_COUNT);

    return Number.isInteger(parsed) && parsed >= 0 ? parsed : 1;
  },
  /**
   * Секрет Cloudflare Turnstile.
   *
   * MED-2: проверка «человек ли это» больше не зависит от NODE_ENV.
   * Раньше при `NODE_ENV !== 'production'` капча просто игнорировалась, а вместе
   * с ней пропускалась и проверка кода подтверждения — то есть неверно собранное
   * окружение открывало регистрацию настежь. Теперь поведение определяется
   * наличием ключа, а в production ключ обязателен.
   */
  get turnstileSecret(): string {
    return isProduction
      ? requireEnv('CF_SECRET_KEY', 8)
      : process.env.CF_SECRET_KEY || '';
  },
  /** Капча включена, если для неё настроен ключ. */
  get isCaptchaEnabled(): boolean {
    return Boolean(this.turnstileSecret);
  },
  /**
   * Явный флаг вывода кодов подтверждения в журнал (MED-6).
   *
   * Раньше код печатался при любом значении NODE_ENV, кроме production.
   * Теперь нужно осознанно выставить OTP_DEBUG_LOG=true, и в production
   * это не работает ни при каких условиях.
   */
  get isOtpDebugLogEnabled(): boolean {
    return !isProduction && process.env.OTP_DEBUG_LOG === 'true';
  }
};

export const envUtils = { requireEnv };
