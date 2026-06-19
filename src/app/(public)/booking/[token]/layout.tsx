import { FC, PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/containers/app-header';
import { ContactsWidget } from '@/widgets/contacts/containers/contacts-widget';

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
