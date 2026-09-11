'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { FC, PropsWithChildren } from 'react';

import { queryClient } from '@/shared/api/query-client';
import { YandexMetrika } from '@/shared/lib/analytics/yandex-metrika';

/*
 * Схемы организации здесь больше нет.
 *
 * Провайдер оборачивает всё приложение, поэтому `TouristInformationCenter`
 * выводился на каждой из 868 страниц — в том числе на статьях про пещеры,
 * где организация к содержимому отношения не имеет. Теперь схема живёт
 * в `shared/lib/seo/organization.ts` и выводится только на главной и
 * контактах; тип заодно исправлен на `TravelAgency`.
 */
export const AppProvider: FC<PropsWithChildren> = ({ children }) => (
  <>
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
