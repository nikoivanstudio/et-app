import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { getCurrentYear } from '@/shared/lib/seo/current-year';
import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

/**
 * Каталог туров — единственный на сайте (B7).
 *
 * Их было семь: `/tours`, `/tury`, `/category/vse_tury` (+ `/page/2`),
 * `/dzhip-tur-krym`, `/ekskursii_po_krymu` и `/ekskursii-po-krymu` —
 * последние два различались только подчёркиванием и дефисом. Остальные
 * склеиваются сюда через таблицу переадресаций (`prisma/data/redirects.csv`),
 * `/dzhip-tur-krym` оставлен отдельно: это точное вхождение запроса
 * «джип тур крым» с накопленным возрастом.
 *
 * Заголовок был «Интересная и полезная информация о Крыме» — title раздела
 * статей, приехавший на каталог туров при переносе.
 */
export async function generateMetadata(): Promise<Metadata> {
  const year = getCurrentYear();

  return buildPageMetadata({
    title: `Джип-туры и экскурсии по Крыму — все туры ${year}`,
    description:
      'Каталог джип-туров и индивидуальных экскурсий по Крыму: пещерные города, каньоны и плато. Цена за машину, выезд из Бахчисарая и Севастополя, заявка за минуту.',
    path: '/tours'
  });
}

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
