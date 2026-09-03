const isProduction = process.env.NODE_ENV === 'production';

const PRODUCTION_ORIGINS = ['https://okryme.ru', 'https://energy-tur.ru'];

/**
 * localhost допускается только вне production: раньше он оставался в списке
 * и в боевой сборке.
 */
export const ALLOWED_ORIGINS = isProduction
  ? PRODUCTION_ORIGINS
  : [...PRODUCTION_ORIGINS, 'http://localhost:3000'];

/** Общий лимит на обычные запросы. */
export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX = 60;

/**
 * Отдельный, значительно более строгий лимит на формы аутентификации (HIGH-1):
 * вход, регистрация, смена пароля и запрос кода подтверждения.
 */
export const AUTH_RATE_LIMIT_WINDOW_MS = 10 * 60_000;
export const AUTH_RATE_LIMIT_MAX = 20;

/** Пути, POST-запросы к которым считаются попыткой аутентификации. */
export const AUTH_SENSITIVE_PATHS = [
  '/sign-in',
  '/sign-up',
  '/api/otp',
  '/api/callback'
];

export const PROTECTED_API_PREFIX = process.env.API_ROUTE || '/api/';

/** Методы, не изменяющие состояние: для них проверка Origin не требуется. */
export const SAFE_HTTP_METHODS = ['GET', 'HEAD', 'OPTIONS'];
