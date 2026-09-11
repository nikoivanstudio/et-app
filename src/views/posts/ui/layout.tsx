'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';
import { postsServices } from '@/widgets/posts/services/posts-services';
import { ServerPostCardList } from '@/widgets/posts/ui/server-post-card-list';

import { SectionBody, SectionHead } from '@/entities/page-head/server';

import { sectionCrumbs } from '@/shared/lib/seo/breadcrumbs';

import { Pagination } from '@/views/posts/ui/pagination';

type Props = {
  page?: string;
};

/**
 * Крошки каталога: на нём, на `/tours` и на `/uslugi` их не было совсем —
 * у трёх каталогов своя шапка, и C2 прошла мимо них. Для страницы,
 * на которую ведут крошки со всех статей раздела, путь в сниппете —
 * ровно то, ради чего разметка и ставилась.
 */
const POSTS_CRUMBS = sectionCrumbs('Интересное о Крыме');

/**
 * Список статей.
 *
 * Было: шапка `pt-[35vh]` с фото женщины в вечернем платье (тот же кадр, что
 * на /tours, /kontakty и /activities), а контент поднят на −90px — заголовок
 * «Интересные статьи о Крыме» целиком уходил под первую карточку, и на
 * странице не было видно ни одного заголовка.
 */
export const PostsView: FC<Props> = async ({ page }) => {
  const result = await postsServices.getPaginatedPostCards({ page });

  if (result.type === 'left') {
    return (
      <AppMain
        mainHead={<SectionHead page='posts' title='Интересное о Крыме' />}
        mainContent={
          <SectionBody crumbs={POSTS_CRUMBS}>
            <div className='border-rule bg-cream rounded-card border px-5 py-10 text-center'>
              <p className='font-caladea text-ink text-base font-bold'>
                Статьи сейчас не загрузились
              </p>
              <p className='font-caladea text-ink-muted mt-2 text-[14.5px]'>
                Обновите страницу — или позвоните, и мы расскажем про маршруты
                голосом.
              </p>
            </div>
            <div className='h-14' />
          </SectionBody>
        }
        mainBottom={null}
      />
    );
  }

  const { list, totalPages, total } = result.value;
  const currentPage = page ? Number(page) : 1;

  return (
    <AppMain
      mainHead={
        <SectionHead
          page='posts'
          kicker={`${total} маршрутов · описания и цены`}
          title='Интересное о Крыме'
          lead='Куда едем, сколько это занимает и что смотрим по дороге — по каждому маршруту отдельно.'
        />
      }
      mainContent={
        <SectionBody crumbs={POSTS_CRUMBS}>
          <ServerPostCardList list={list} />
        </SectionBody>
      }
      mainBottom={
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          shown={list.length}
        />
      }
    />
  );
};
