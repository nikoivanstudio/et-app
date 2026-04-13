import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/containers/app-header';
import { ContactsWidget } from '@/widgets/contacts/containers/contacts-widget';

export const metadata: Metadata = {
  title: 'Интересная и полезная информация о Крыме',
  description:
    'Интересные статьи о полуострове Крым. Полезные записи о Крыме и свежие туристические новости'
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
