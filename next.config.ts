import type { NextConfig } from 'next';

/**
 * Заголовки безопасности (MED-1).
 *
 * До этого приложение не выдавало ни одного: не было ни CSP, ни HSTS,
 * ни X-Frame-Options, ни запрета угадывания типа содержимого.
 *
 * CSP выдаётся в режиме Report-Only — как и рекомендовано в отчёте. В этом
 * режиме браузер не блокирует ресурсы, а только сообщает о нарушениях
 * в консоли, поэтому включение политики не может сломать сайт. После того как
 * консоль на боевом трафике окажется чистой, замените имя заголовка
 * на `Content-Security-Policy`, чтобы политика начала действовать.
 */
const s3Origin = process.env.S3_PUBLIC_ORIGIN || '';

const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-inline' необходим: Next.js вставляет служебные inline-скрипты,
  // а счётчик Яндекс.Метрики подключается inline-фрагментом.
  // Чтобы отказаться от него, потребуется перевести все inline-скрипты на nonce.
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  // energy-tur.ru — источник всех фотографий постов и легаси-каталога
  // (и обложки, и картинки внутри content). Без него включение политики
  // (не Report-Only) обнулит фото на страницах туров.
  `img-src 'self' data: blob: https://okryme.ru https://energy-tur.ru https://mc.yandex.ru ${s3Origin}`.trim(),
  "font-src 'self' data:",
  `connect-src 'self' https://mc.yandex.ru https://challenges.cloudflare.com ${s3Origin}`.trim(),
  // Виджеты карты, капчи и видео
  "frame-src 'self' https://yandex.ru https://challenges.cloudflare.com https://www.youtube.com https://mc.yandex.ru",
  "media-src 'self' blob: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests'
].join('; ');

const securityHeaders = [
  {
    // Браузер запомнит, что на домен нужно ходить только по HTTPS.
    // Убирает возможность перехвата первого запроса (SSL strip).
    // Учтите: includeSubDomains распространяется на ВСЕ поддомены —
    // если какой-то из них работает только по HTTP, уберите этот параметр.
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    // Запрет угадывания типа содержимого в обход Content-Type
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    // Защита от размещения сайта во фрейме (clickjacking)
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    // Функции, которые приложению не нужны, отключаются явно
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: cspDirectives
  }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // MED-10: не сообщаем версию и название фреймворка
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  },
  experimental: {
    useCache: true,
    cpus: 4,
    workerThreads: false
  },
  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: '/images/**'
      }
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'okryme.ru',
        pathname: '/wp-content/**'
      },
      {
        protocol: 'https',
        hostname: 'energy-tur.ru',
        pathname: '/wp-content/**'
      }
    ]
  }
};

export default nextConfig;
