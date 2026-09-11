import type { Metadata } from 'next';
import { FC } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { getCurrentYear } from '@/shared/lib/seo/current-year';
import { buildOrganizationJsonLd } from '@/shared/lib/seo/organization';
import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';
import { JsonLd } from '@/shared/ui/json-ld';

import { HomeView } from '@/views/home/server';

// Главной не было в sitemap и — после чистки корневого layout — не осталось
// бы canonical. Задаём и то и другое здесь.
//
// Не `export const metadata`, а функция: год должен вычисляться при рендере.
// Константа вычисляется один раз при загрузке модуля, и контейнер, поднятый
// в декабре, в январе продолжил бы отдавать прошлый год.
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Джип туры и индивидуальные экскурсии по Крыму — Energy Tour',
    description: `Джип туры и индивидуальные экскурсии по Крыму в ${getCurrentYear()} году. Бахчисарай, Ялта, Севастополь. Организация отдыха под ключ. Лучшие цены +7 (978) 788-07-53`,
    path: '/'
  });
}

const Home: FC = async () => (
  <>
    {/* Схема организации — на главной и контактах. До этого она выводилась
        на каждой странице сайта из провайдера приложения. */}
    <JsonLd data={buildOrganizationJsonLd()} />
    <AppHeader variant='public' />
    <HomeView />
    <footer>
      <ContactsWidget />
    </footer>
  </>
);

export default Home;
