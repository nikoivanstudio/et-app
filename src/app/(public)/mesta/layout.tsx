import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Места Крыма: пещерные города, каньоны и плато',
  description:
    'Куда возят джип-туры по Крыму: Мангуп-Кале, Чуфут-Кале, Эски-Кермен, Тепе-Кермен, Качи-Кальон, Бельбекский каньон. По каждому объекту — описание и маршруты, которые сюда заезжают.',
  path: '/mesta'
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
