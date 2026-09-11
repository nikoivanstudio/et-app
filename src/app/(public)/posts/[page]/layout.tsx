import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { getCurrentYear } from '@/shared/lib/seo/current-year';
import {
  buildPageMetadata,
  withPaginationRobots
} from '@/shared/lib/seo/page-metadata';

/**
 * Метаданные страницы пагинации.
 *
 * В sitemap было 76 адресов `/posts/2…77` с одинаковым title и собственным
 * каноническим адресом — 76 страниц-близнецов в индексе, каждая из которых
 * конкурирует с разделом. Намерение склеить их было описано в коде, но
 * реализовано только для первой страницы.
 *
 * Что сделано:
 *
 * 1. `/posts/1` по-прежнему объявляет каноническим `/posts` — это буквально
 *    тот же список, и пагинация из `/posts/2` уводит назад именно на `/posts/1`.
 * 2. Страницы со второй и дальше уходят в `noindex, follow`: в индексе им
 *    делать нечего, а обход по ссылкам на карточки должен продолжаться.
 *    Канонический адрес у них свой: указывать canonical на `/posts` со
 *    страницы с другим содержимым — заявка, которую поисковик всё равно
 *    отклонит, а вместе с ней может отбросить и сигнал `noindex`.
 * 3. Номер страницы попал в title: одинаковые заголовки у десятков адресов
 *    Вебмастер считает отдельным дефектом, даже когда адреса закрыты.
 *
 * Из sitemap эти адреса убраны (см. `app/_lib/sitemap-service.ts`).
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = Number(page);
  const isFirstPage = !Number.isFinite(pageNumber) || pageNumber <= 1;

  const year = getCurrentYear();

  const metadata = buildPageMetadata({
    title: isFirstPage
      ? `Интересные статьи о Крыме в ${year}`
      : `Интересные статьи о Крыме — страница ${pageNumber}`,
    description: isFirstPage
      ? `Статьи о Крыме в ${year} году: пещерные города, каньоны, плато и маршруты джип-туров. Куда съездить и что посмотреть на полуострове.`
      : `Статьи о Крыме, страница ${pageNumber}: маршруты, объекты и полезное перед поездкой.`,
    path: isFirstPage ? '/posts' : `/posts/${pageNumber}`
  });

  return isFirstPage ? metadata : withPaginationRobots(metadata);
}

export default function Layout({
  children
}: PropsWithChildren<{
  params: Promise<{ page?: string }>;
}>) {
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
