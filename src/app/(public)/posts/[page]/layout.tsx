import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

/**
 * Канонический адрес зависит от номера страницы, поэтому статическим
 * объектом его не задать.
 *
 * Отдельно про первую страницу: пагинация из `/posts/2` уводит назад на
 * `/posts/1` — тот же список, что и на `/posts`. Показываем поисковику, что
 * это один адрес, иначе получаем гарантированный дубль.
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = Number(page);
  const isFirstPage = !Number.isFinite(pageNumber) || pageNumber <= 1;

  return buildPageMetadata({
    title: 'Интересные статьи о Крыме в 2026',
    description:
      'Все туры в Крыму 2026. Организация туров и ваших развлечений. Мы предоставим лучшие цены для вас +7(978)7880753',
    path: isFirstPage ? '/posts' : `/posts/${pageNumber}`
  });
}

export default function Layout({
  children
}: PropsWithChildren<{
  params: Promise<{ page?: string }>;
}>) {
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
