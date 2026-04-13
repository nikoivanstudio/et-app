import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

export const metadata: Metadata = {
  title: 'Туристические услуги в Крыму 2026 Бахчисарай, Ялта, Севастополь',
  description:
    'Туристические услуги в Крыму 2026. Организация туров и ваших развлечений. Мы предоставим лучшие цены для вас +7(978)7880753'
};

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
