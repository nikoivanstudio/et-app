'use server';

import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';
import { TourPhotoSwiper } from '@/widgets/photo-swiper/server';

import { ServerDurationLabel } from '@/entities/duration/server';
import { MockReviewsAvatars } from '@/entities/mock-reviews-avatars';
import { PageHeadTour } from '@/entities/page-head/server';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';
import { BadgePrice } from '@/shared/ui/badge-price';
import { TextContent } from '@/shared/ui/text-content';

import { TourKernel } from '@/kernel/tour/domain';

const cnPageTour = cnBem('PageTour');

export const TourMain: FC<TourKernel> = async props => {
  const { id, title, mainPhoto, rating, price, duration, photos, content } =
    props;

  return (
    <AppMain
      mainHead={<PageHeadTour {...{ id, title, mainPhoto }} />}
      mainContent={
        <div
          className={cnPageTour('Content', [
            'bg-white',
            'rounded-4xl',
            'p-2',
            'mt-[-3vh]',
            'relative',
            'z-3'
          ])}
        >
          <section className={cnPageTour('DescriptionBlock')}>
            <div className='flex justify-between pr-5'>
              <span
                className={cn(
                  styles.poiret_text_black,
                  'text-2xl',
                  'block',
                  'p-2'
                )}
              >
                Описание тура
              </span>
              <MockReviewsAvatars rating={rating} />
            </div>
            <div
              className={cnPageTour('TourProperties', [
                'flex',
                'items-center',
                'gap-6',
                'p-1',
                'mt-3'
              ])}
            >
              <BadgePrice
                className={cnPageTour('TourPrice')}
                price={price}
                variant='black-white'
              />
              <ServerDurationLabel
                duration={duration}
                variant='black-white'
                color='black'
              />
            </div>
          </section>
          <section className={cnPageTour('PhotoBlock', ['mt-1'])}>
            <TourPhotoSwiper photos={photos} />
          </section>
          <section className={cnPageTour('Content', ['mt-8', 'pb-14'])}>
            <div>
              <TextContent content={content as TrustedHTML} />
            </div>
          </section>
        </div>
      }
      mainBottom={null}
    />
  );
};
