import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { getCurrentYear } from '@/shared/lib/seo/current-year';
import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

// Дочерние страницы услуг объявлены `force-static`, поэтому год здесь
// запекается на сборке, а не на запросе. Для ежегодно пересобираемого
// проекта этого достаточно; если деплои станут редкими — добавить
// `revalidate` этому маршруту.
export async function generateMetadata(): Promise<Metadata> {
  const year = getCurrentYear();

  return buildPageMetadata({
    title: `Туристические услуги в Крыму ${year} Бахчисарай, Ялта, Севастополь`,
    description: `Туристические услуги в Крыму ${year}. Организация туров и ваших развлечений. Мы предоставим лучшие цены для вас +7(978)7880753`,
    path: '/uslugi'
  });
}

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
