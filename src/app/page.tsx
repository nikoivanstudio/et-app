import type { Metadata } from 'next';
import { FC } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

import { HomeView } from '@/views/home/server';

// Главной не было в sitemap и — после чистки корневого layout — не осталось
// бы canonical. Задаём и то и другое здесь.
export const metadata: Metadata = buildPageMetadata({
  title: 'Джип туры и индивидуальные экскурсии по Крыму — Energy Tour',
  description:
    'Джип туры и индивидуальные экскурсии по Крыму в 2026 году. Бахчисарай, Ялта, Севастополь. Организация отдыха под ключ. Лучшие цены +7 (978) 788-07-53',
  path: '/'
});

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
