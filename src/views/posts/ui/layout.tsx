'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';
import { postsServices } from '@/widgets/posts/services/posts-services';
import { ServerPostCardList } from '@/widgets/posts/ui/server-post-card-list';

import { PageHeadLayout } from '@/entities/page-head/server';
import { PageTitle } from '@/entities/page-title/server';

import { cn } from '@/shared/lib/css';

import { Pagination } from '@/views/posts/ui/pagination';

type Props = {
  page?: string;
};

export const PostsView: FC<Props> = async ({ page }) => {
  const result = await postsServices.getPaginatedPostCards({ page });

  if (result.type === 'left') {
    return <div>Возникла ошибка... попробуйте повторить действие позже</div>;
  }

  const { list } = result.value;

  return (
    <AppMain
      mainHead={
        <PageHeadLayout
          className={cn('pt-[35vh]', 'px-4')}
          title={<PageTitle topTitle={{ text: 'Интересные статьи о Крыме' }} />}
          content={null}
          page='tours'
        />
      }
      mainContent={
        <div className={cn('p-4', 'mt-[-90px]')}>
          <ServerPostCardList list={list} />
        </div>
      }
      mainBottom={
        <Pagination
          currentPage={page ? Number(page) : 1}
          totalPages={result.value.totalPages}
        />
      }
    />
  );
};
