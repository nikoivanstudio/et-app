import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { getCurrentYear } from '@/shared/lib/seo/current-year';
import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

// Год в заголовке вычисляется при рендере — см. `seo/current-year.ts`.
export async function generateMetadata(): Promise<Metadata> {
  const year = getCurrentYear();

  return buildPageMetadata({
    title: `Интересные статьи о Крыме в ${year}`,
    description: `Все туры в Крыму ${year}. Организация туров и ваших развлечений. Мы предоставим лучшие цены для вас +7(978)7880753`,
    path: '/posts'
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
