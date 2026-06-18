'use server';

import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';

import { MockReviewsAvatars } from '@/entities/mock-reviews-avatars';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';

import { TourKernel } from '@/kernel/tour/domain';
import { PageHeadPost } from '@/views/post/ui/page-head-post';
import { PostStats } from '@/views/post/ui/post-stats';
import { TourContentView } from '@/views/tour/ui/tour-content';

const cnPageTour = cnBem('PageTour');

export const TourMain: FC<TourKernel> = async props => {
  const { id, title, mainPhoto, rating, price, duration, photos, content } =
    props;

  return (
    <AppMain
      mainHead={<PageHeadPost {...{ id, title, mainPhoto }} />}
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
                Информация
              </span>
              <MockReviewsAvatars rating={rating || 4.9} />
            </div>
            <PostStats
              className={cn('mt-4', 'mx-2')}
              priceValue={price}
              durationValue={duration}
            />
          </section>
          <section className={cnPageTour('Content', ['mt-4', 'pb-14'])}>
            <TourContentView
              content={content}
              photos={photos.map(photo => ({
                source: photo.source,
                title: photo.title
              }))}
            />
          </section>
        </div>
      }
      mainBottom={null}
    />
  );
};
