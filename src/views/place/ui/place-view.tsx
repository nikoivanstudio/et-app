'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';

import { placeCrumbs } from '@/shared/lib/seo/breadcrumbs';
import { buildPlaceJsonLd } from '@/shared/lib/seo/json-ld';
import { JsonLd } from '@/shared/ui/json-ld';
import { LeadActions } from '@/shared/ui/lead-actions';
import { SectionHeading } from '@/shared/ui/section-heading';
import { TextContent } from '@/shared/ui/text-content';
import { TourLinks } from '@/shared/ui/tour-links';

import type { PlaceView as PlaceViewModel } from '@/kernel/place/server';
import { PageHeadPost } from '@/views/post/ui/page-head-post';

/**
 * Страница объекта: `/mesta/{slug}` (задача E2).
 *
 * Ради чего она существует. Справочник на 780 страниц про Крым — актив,
 * которого нет ни у Turnado, ни у Sputnik8, ни у Tripster. Но до сих пор
 * это был тупик: человек искал «Мангуп-Кале», читал описание и уходил,
 * потому что уйти со страницы было некуда. Здесь под описанием стоят туры,
 * которые сюда заезжают, с ценой и переходом на карточку, а рядом — форма
 * заявки и мессенджеры.
 */
export const PlaceView: FC<PlaceViewModel> = async ({ place, tours }) => {
  const jsonLd = buildPlaceJsonLd({
    title: place.title,
    description: place.description ?? '',
    path: `/mesta/${place.slug}`,
    image: place.mainImage,
    latitude: place.latitude,
    longitude: place.longitude,
    city: place.city,
    district: place.district,
    tours: tours.map(tour => ({
      title: tour.title,
      path: `/tour/${tour.slug}`
    }))
  });

  const facts = [place.kind, place.district ?? place.city].filter(Boolean);

  return (
    <AppMain
      mainHead={
        <PageHeadPost
          id={place.id}
          title={place.title}
          mainPhoto={place.mainImage ?? null}
          crumbs={placeCrumbs(place.title)}
          facts={
            !!facts.length && (
              <>
                {facts.map((fact, index) => (
                  <span key={fact}>
                    {index > 0 && <span className='opacity-50'> · </span>}
                    <span className='opacity-90'>{fact}</span>
                  </span>
                ))}
              </>
            )
          }
        />
      }
      mainContent={
        <div className='relative z-3 -mt-8 rounded-t-[32px] bg-white px-4 pt-7 pb-14 md:px-6'>
          {/* Схема не выводится без координат: TouristAttraction без geo
              не даёт поисковику ничего сверх текста страницы. */}
          {!!jsonLd && <JsonLd data={jsonLd} />}

          <div className='mx-auto w-full max-w-[720px]'>
            {!!place.description && (
              <p className='font-caladea text-ink text-[15.5px] leading-relaxed'>
                {place.description}
              </p>
            )}

            {!!place.content && (
              <div className='et-post mt-5'>
                <TextContent
                  content={place.content as TrustedHTML}
                  unstyled
                  legacy
                />
              </div>
            )}

            <TourLinks
              className='mt-2'
              items={tours}
              title={`Туры с заездом на ${place.title}`}
              lead='Маршруты, которые включают этот объект. Цена за машину до шести человек.'
            />

            {/* Туров может не быть: объект заводится раньше, чем маршрут
                к нему. Тогда блок выше не выводится, и единственный выход
                со страницы — заявка. */}
            <LeadActions
              className='mt-9'
              entityName={place.title}
              entityId={place.slug}
              note='Подберём маршрут с заездом сюда и подскажем, когда лучше ехать'
            />

            {!!place.latitude && !!place.longitude && (
              <>
                <SectionHeading>Где это</SectionHeading>
                <p className='font-caladea text-ink-muted text-[14px]'>
                  {[place.district, place.city].filter(Boolean).join(', ')}
                  {!!place.district || !!place.city ? ' · ' : ''}
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </p>
              </>
            )}
          </div>
        </div>
      }
      mainBottom={null}
    />
  );
};
