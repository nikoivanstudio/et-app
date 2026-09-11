'use server';

import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';

import { BookingButton } from '@/features/booking';

import { GuideCard, RatingPill } from '@/entities/guide';

import { JEEP_TOUR_FAQ } from '@/shared/constants/faq-constants';
import { cn } from '@/shared/lib/css';
import { tourCrumbs } from '@/shared/lib/seo/breadcrumbs';
import { buildTourJsonLd } from '@/shared/lib/seo/json-ld';
import { FaqSection } from '@/shared/ui/faq-section';
import { JsonLd } from '@/shared/ui/json-ld';

import { guideServices } from '@/kernel/guide/server';
import { TourKernel } from '@/kernel/tour/domain';
import { PageHeadPost } from '@/views/post/ui/page-head-post';
import { PostStats } from '@/views/post/ui/post-stats';
import { TourContentView } from '@/views/tour/ui/tour-content';

const cnPageTour = cnBem('PageTour');

/**
 * Координаты остановки в маршруте лежат строкой вида «44.6019, 33.7981».
 * В разметке они нужны числами; строку, из которой не получается пара
 * чисел, молча пропускаем — выдуманная точка на карте хуже её отсутствия.
 */
const parseCoordinates = (
  value?: string
): { latitude: number; longitude: number } | undefined => {
  if (!value) {
    return undefined;
  }

  const [latitude, longitude] = value
    .split(/[,;]\s*/)
    .map(part => Number(part.trim().replace(',', '.')));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return undefined;
  }

  return { latitude, longitude };
};

export const TourMain: FC<TourKernel> = async props => {
  const {
    id,
    title,
    slug,
    description,
    mainPhoto,
    rating,
    price,
    priceUnit,
    duration,
    photos,
    content,
    authorId,
    reviews,
    faq,
    startCity
  } = props;

  const guideEither = await guideServices.getGuideSummary(authorId);
  const guide = guideEither.type === 'right' ? guideEither.value : null;

  // Свои вопросы тура, если они заполнены; иначе общий набор по джип-турам.
  // Пустого блока не будет: FaqSection сам ничего не рендерит на пустом
  // списке, и разметки в этом случае тоже нет.
  const faqItems = faq.length ? faq : JEEP_TOUR_FAQ;

  /**
   * Разметка товара.
   *
   * `reviews.length` передаётся не для полноты: `AggregateRating` ставится
   * только там, где отзывы реально есть — иначе это накрутка, за которую
   * снимают расширенный сниппет целиком. Отзывов в базе пока нет ни одного
   * (задача G5 — наладить их сбор), так что на сегодня рейтинг в разметку
   * не попадёт, и это правильное поведение, а не недоработка.
   */
  const tourJsonLd = buildTourJsonLd({
    title,
    description: description || content.lead,
    path: `/tour/${slug}`,
    image: mainPhoto,
    price,
    priceUnit,
    durationHours: duration,
    rating,
    reviewsCount: reviews.length,
    guideName: guide?.displayName,
    startCity,
    stops: content.routeStops.map(stop => ({
      name: stop.title,
      ...parseCoordinates(stop.coordinates)
    }))
  });

  return (
    <AppMain
      mainHead={
        <PageHeadPost
          {...{ id, title, mainPhoto }}
          crumbs={tourCrumbs(title)}
        />
      }
      mainContent={
        <div
          className={cnPageTour('Content', [
            'bg-white',
            'rounded-t-[32px]',
            'p-2',
            '-mt-8',
            'relative',
            'z-3',
            'mx-auto',
            'max-w-[820px]'
          ])}
        >
          <JsonLd data={tourJsonLd} />

          {/* Было: «Информация» и рядом мок «★ 4,9/5» с тремя стоковыми
              аватарами — при пустом rating он показывал 4,9 всегда. Теперь
              пилюля появляется, только если оценка действительно есть. */}
          <section className={cnPageTour('DescriptionBlock')}>
            {!!rating && (
              <RatingPill className='mx-2 mb-3' rating={rating} withMax />
            )}
            <PostStats
              className={cn('mx-2')}
              priceValue={price}
              durationValue={duration}
            />
            {!!guide && (
              <GuideCard guide={guide} className={cn('mt-3', 'mx-2')} />
            )}
            <div className={cn('mt-3', 'mx-2')}>
              <BookingButton
                tourId={id}
                priceLabel={
                  price
                    ? `от ${new Intl.NumberFormat('ru-RU').format(price)} ₽`
                    : undefined
                }
                className={cn('w-full')}
              />
            </div>
          </section>
          <section className={cnPageTour('Content', ['mt-4'])}>
            <TourContentView
              content={content}
              photos={photos.map(photo => ({
                source: photo.source,
                title: photo.title
              }))}
            />
          </section>
          <div className='mx-2 pb-14'>
            <FaqSection items={faqItems} />
          </div>
        </div>
      }
      mainBottom={null}
    />
  );
};
