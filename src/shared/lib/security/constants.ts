export const ALLOWED_ORIGINS = [
  'https://okryme.ru',
  'https://energy-tur.ru',
  'http://localhost:3000'
];
export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX = 60;
export const PROTECTED_API_PREFIX = process.env.API_ROUTE || '/api/';
