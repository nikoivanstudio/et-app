import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { getCurrentYear } from '@/shared/lib/seo/current-year';
import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

/**
 * Посадочная «джип туры Крым» — точное вхождение высокочастотного запроса.
 *
 * В склейку каталогов (B7) не входит намеренно: у адреса накоплен возраст,
 * и это единственная страница сайта, отвечающая запросу буквально.
 *
 * Заголовок был про экскурсии, а описание повторяло его слово в слово —
 * поисковик такое описание просто отбрасывает и собирает сниппет сам.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: `Джип туры по Крыму ${getCurrentYear()} — цена за машину, выезд из Бахчисарая`,
    description:
      'Джип-туры по Крыму на подготовленных внедорожниках: пещерные города, каньоны, плато. Цена за машину до 6 человек, забираем от жилья, маршрут подбираем под погоду.',
    path: '/dzhip-tur-krym'
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
