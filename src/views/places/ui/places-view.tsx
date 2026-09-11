'use server';

import Link from 'next/link';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';

import { SectionBody, SectionHead } from '@/entities/page-head/server';

import { buildItemListJsonLd } from '@/shared/lib/seo/json-ld';
import { EmptyState } from '@/shared/ui/empty-state';
import { JsonLd } from '@/shared/ui/json-ld';
import { LinkButton } from '@/shared/ui/link-button';

import type { PlaceEntity } from '@/kernel/place/server';

type Props = {
  places: PlaceEntity[];
};

/**
 * Раздел объектов: `/mesta` (E2).
 *
 * Второй уровень структуры, которого у сайта не было: 780 из 868 адресов
 * лежали в корне одним уровнем. Раздел — это и вход для человека,
 * и внутренняя ссылка на каждый объект, без которой страницы объектов
 * обходились бы только из sitemap.
 */
export const PlacesView: FC<Props> = async ({ places }) => (
  <AppMain
    mainHead={
      <SectionHead
        page='places'
        kicker={
          places.length
            ? `${places.length} объектов · Крым`
            : 'Пещерные города, каньоны и плато'
        }
        title='Места Крыма'
        lead='Куда возят джип-туры: пещерные города, каньоны, плато и дворцы. По каждому — как добраться и какие маршруты сюда заезжают.'
      />
    }
    mainContent={
      <SectionBody className='pb-16'>
        <JsonLd
          data={buildItemListJsonLd({
            path: '/mesta',
            name: 'Места Крыма',
            items: places.map(place => ({
              title: place.title,
              path: `/mesta/${place.slug}`
            }))
          })}
        />

        {places.length ? (
          <ul className='flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3'>
            {places.map(place => (
              <li key={place.slug}>
                <Link
                  className='border-rule bg-cream hover:bg-cream-deep rounded-block flex h-full min-h-[76px] flex-col justify-center gap-1 border p-3.5 transition-colors'
                  href={`/mesta/${place.slug}`}
                >
                  <span className='font-caladea text-ink text-[15px] font-bold'>
                    {place.title}
                  </span>
                  <span className='font-oswald text-ink-muted text-[12.5px]'>
                    {[place.kind, place.district ?? place.city]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          /* Объекты заводятся из справочника, и до этого раздел пуст.
             Пустой <ul> между шапкой и подвалом — то, из-за чего /tours
             выглядела сломанной страницей. */
          <EmptyState
            title='Объекты ещё размечаем'
            text='Описания пещерных городов, каньонов и плато пока живут в разделе статей. Маршруты по ним уже собраны в каталоге.'
            action={
              <LinkButton className='w-full md:w-[260px]' href='/tours'>
                Смотреть туры
              </LinkButton>
            }
          />
        )}
      </SectionBody>
    }
    mainBottom={null}
  />
);
