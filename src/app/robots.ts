import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/shared/constants/site-constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Disallow в robots.txt работает по префиксу, так что '/api'
        // закрывает и все вложенные пути.
        disallow: [
          '/api',
          '/account',
          '/dashboard',
          '/sign-in',
          '/sign-up',
          // Адрес брони содержит токен: обходить его не нужно.
          '/booking',
          // Форма заявки партнёра — приватный раздел.
          '/become-partner'
        ]
      }
    ],
    sitemap: absoluteUrl('/sitemap.xml')
  };
}
