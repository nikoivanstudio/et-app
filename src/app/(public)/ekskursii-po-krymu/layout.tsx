import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

/**
 * Посадочная по экскурсиям.
 *
 * Адрес переименован из `/ekskursii_po_krymu` (B7). Подчёркивание поисковик
 * не считает разделителем слов — «ekskursii_po_krymu» читается одним
 * токеном, — и вдобавок на сайте существовали оба варианта написания сразу.
 * Старый адрес уводится 301-м через таблицу переадресаций
 * (`prisma/data/redirects.csv`).
 *
 * Описание было собрано автоматически из начала текста и начиналось со
 * списка «В стоимость включено» — в сниппете это выглядело обрывком.
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Экскурсии по Крыму на внедорожниках — цены и маршруты',
  description:
    'Индивидуальные экскурсии по Крыму на подготовленных внедорожниках: 6 мест в машине, выезд в любое время, пикник на маршруте. В цену входят авто, топливо, водитель-инструктор и сборы.',
  path: '/ekskursii-po-krymu'
});

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
