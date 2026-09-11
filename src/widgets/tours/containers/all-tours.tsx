'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { tourService } from '@/features/tour/server';

import { buildItemListJsonLd } from '@/shared/lib/seo/json-ld';
import { JsonLd } from '@/shared/ui/json-ld';
import { LegacyTourCard } from '@/shared/ui/legacy-tour-card';

import { firstPage, secondPage } from '@/views/legacy/constants/tours';

import { ServerLayout } from '../ui/server-layout';
import { ServerTourCardList } from '../ui/server-tour-card-list';

const cnAllTours = cn('AllTours');

const gridClassName =
  'flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3';

/**
 * Каталог туров — единственный на сайте (B7) и единственная витрина,
 * на которую ведут все кнопки «все туры» (A5).
 *
 * Почему здесь запасной список. В базе нет ни одного опубликованного тура
 * (A1 подтвердил это запросом к дампу), а маршруты, которые фактически
 * продаются, существуют только как легаси-страницы. Пустой каталог
 * означал бы одно из двух: либо кнопки продолжают вести на
 * `/category/vse_tury` — и семь конкурирующих каталогов остаются семью,
 * либо человек приходит на страницу без единой карточки.
 *
 * Поэтому каталог показывает то, что есть: записи из базы, как только они
 * появятся, а до тех пор — легаси-маршруты. Второе исчезнет само в день,
 * когда в базе появится первый тур (A4), и трогать код для этого
 * не придётся.
 */
export const AllTours: FC = async () => {
  const tours = await tourService.getTourCards();
  const legacyTours = tours.length ? [] : [...firstPage, ...secondPage];

  return (
    <ServerLayout
      className={cnAllTours(null, ['mx-auto max-w-[1120px] px-4 pb-20'])}
      list={
        <>
          {/* Перечень ссылками, а не двадцать Product со своими офферами:
              на странице каталога товара нет, есть список. */}
          <JsonLd
            data={buildItemListJsonLd({
              path: '/tours',
              name: 'Джип-туры и экскурсии по Крыму',
              items: tours.length
                ? tours.map(tour => ({
                    title: tour.title,
                    path: `/tour/${tour.slug}`
                  }))
                : legacyTours.map(tour => ({
                    title: tour.title,
                    path: tour.href
                  }))
            })}
          />

          {tours.length ? (
            <ServerTourCardList className={gridClassName} tours={tours} />
          ) : (
            <ul className={gridClassName}>
              {legacyTours.map(tour => (
                <li key={tour.href}>
                  <LegacyTourCard tour={tour} />
                </li>
              ))}
            </ul>
          )}
        </>
      }
    />
  );
};
