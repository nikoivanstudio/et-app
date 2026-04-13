import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

export const metadata: Metadata = {
  title: 'Интересные статьи о Крыме в 2026',
  description:
    'Все туры в Крыму 2026. Организация туров и ваших развлечений. Мы предоставим лучшие цены для вас +7(978)7880753'
};

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
