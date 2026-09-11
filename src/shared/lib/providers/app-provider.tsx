'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { FC, PropsWithChildren } from 'react';

import { queryClient } from '@/shared/api/query-client';
import { YandexMetrika } from '@/shared/lib/analytics/yandex-metrika';

export const AppProvider: FC<PropsWithChildren> = ({ children }) => (
  <>
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TouristInformationCenter',
          name: 'Energy Tour',
          url: 'https://energy-tur.ru',
          telephone: '+79787880753',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'RU',
            addressRegion: 'Крым'
          }
        })
      }}
    />
    <YandexMetrika />
    <QueryClientProvider client={queryClient}>
      {/* Было defaultTheme='dark' + enableSystem: на <html> висел класс
          `dark`, и все токены shadcn переключались на тёмный набор. Отсюда
          белые подписи полей на кремовой карточке входа — 1,06:1, текста на
          экране просто не видно. Тёмной палитры в v2 нет: система одна —
          крем и тушь, поэтому тема зафиксирована светлой. */}
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        forcedTheme='light'
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </>
);
