'use client';

import { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
      <ThemeProvider
        attribute='class'
        defaultTheme='dark'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </>
);
