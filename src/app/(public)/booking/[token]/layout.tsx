import type { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/containers/app-header';
import { ContactsWidget } from '@/widgets/contacts/containers/contacts-widget';

import { buildNoindexMetadata } from '@/shared/lib/seo/page-metadata';

// Адрес брони содержит токен — такой странице нельзя в индекс ни при каких
// условиях, даже если ссылка утечёт наружу.
export const metadata: Metadata = buildNoindexMetadata('Бронирование');

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <AppHeader variant='public' />
    {children}
    <footer>
      <ContactsWidget />
    </footer>
  </>
);

export default Layout;
