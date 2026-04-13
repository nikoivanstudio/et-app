'use server';

import { FC } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { HomeView } from '@/views/home/server';

const Home: FC = async () => (
  <>
    <AppHeader variant='public' />
    <HomeView />
    <footer>
      <ContactsWidget />
    </footer>
  </>
);

export default Home;
