'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { tourService } from '@/features/tour/server';

import { getCurrentYear } from '@/shared/lib/seo/current-year';
import { EmptyState } from '@/shared/ui/empty-state';
import { LinkButton } from '@/shared/ui/link-button';

import { ServerLayout } from '../ui/server-layout';
import { ServerTourCardList } from '../ui/server-tour-card-list';

const cnAllTours = cn('AllTours');

export const AllTours: FC = async () => {
  const tours = await tourService.getTourCards();

  return (
    <ServerLayout
      className={cnAllTours(null, [
        'mx-auto max-w-[1120px] px-4 pb-20 text-center'
      ])}
      list={
        /* Пока в базе нет туров, каталог отдавал пустой <ul>: между шапкой и
           подвалом оставалось 140px пустоты и ни одного слова. */
        tours.length ? (
          <ServerTourCardList
            className='flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'
            tours={tours}
          />
        ) : (
          <EmptyState
            title='Здесь пока пусто'
            text={`Каталог на ${getCurrentYear()} год ещё собирается. Готовые маршруты с ценами и длительностью уже есть в списке всех туров.`}
            action={
              <LinkButton
                className='w-full md:w-[260px]'
                href='/category/vse_tury'
              >
                Смотреть все туры
              </LinkButton>
            }
          />
        )
      }
    />
  );
};
