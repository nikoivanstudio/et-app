import type { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/containers/app-header';
import { ContactsWidget } from '@/widgets/contacts/containers/contacts-widget';

import { buildNoindexMetadata } from '@/shared/lib/seo/page-metadata';

// Раздел заявок целиком закрыт от индексации: адрес самой заявки содержит
// токен, а список «Мои заявки» собирается из браузера посетителя. Метаданные
// стоят на сегменте, а не на странице, чтобы правило действовало и на то,
// что появится здесь дальше.
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
