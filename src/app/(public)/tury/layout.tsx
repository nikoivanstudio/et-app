import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import {
  buildPageMetadata,
  withDuplicateRobots
} from '@/shared/lib/seo/page-metadata';

/**
 * Один из семи конкурирующих каталогов (B7).
 *
 * Содержимого у страницы нет: заголовок «Туры», описание из четырёх
 * символов — тоже «Туры». Адрес склеивается с `/tours` через таблицу
 * переадресаций (`prisma/data/redirects.csv`), но заливать её можно только
 * после наполнения каталога (A4). До тех пор страница остаётся доступной
 * и закрыта от индексации: конкурировать с `/tours` ей нечем, а держать
 * в индексе пустышку — прямой повод для претензии к качеству сайта.
 */
export const metadata: Metadata = withDuplicateRobots(
  buildPageMetadata({
    title: 'Туры по Крыму',
    description:
      'Раздел объединён с каталогом туров. Все джип-туры и экскурсии по Крыму — на странице «Все туры».',
    path: '/tury'
  })
);

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <AppHeader variant='public' />
      {children}
      <footer className='mt-12'>
        <ContactsWidget />
      </footer>
    </>
  );
}
