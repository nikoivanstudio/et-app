'use server';

import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';

import { ServerDurationLabel } from '@/entities/duration/ui/server-duration-label';
import { MockReviewsAvatars } from '@/entities/mock-reviews-avatars';
import { PostDomain } from '@/entities/post/server';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';
import { BadgePrice } from '@/shared/ui/badge-price';
import { TextContent } from '@/shared/ui/text-content';

import { PageHeadPost } from '@/views/post/ui/page-head-post';

const cnPagePost = cnBem('PagePost');

export const PostMain: FC<PostDomain.PostEntity> = async props => {
  const { id, title, image, content, metaDuration, metaPrice } = props;

  return (
    <AppMain
      mainHead={<PageHeadPost {...{ id, title, mainPhoto: image }} />}
      mainContent={
        <div
          className={cnPagePost('Content', [
            'bg-white',
            'rounded-4xl',
            'p-2',
            'mt-[-3vh]',
            'relative',
            'z-3'
          ])}
        >
          <section className={cnPagePost('DescriptionBlock')}>
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
              <MockReviewsAvatars rating={4.9} />
            </div>
            <div
              className={cnPagePost('TourProperties', [
                'flex',
                !!metaPrice || !!metaDuration
                  ? 'flex-col items-start'
                  : 'items-center',
                'gap-6',
                'p-1',
                'mt-3'
              ])}
            >
              {!!metaPrice && (
                <BadgePrice
                  className={cnPagePost('TourPrice')}
                  price={metaPrice}
                  variant='black-white'
                />
              )}
              {!!metaDuration && (
                <ServerDurationLabel
                  duration={metaDuration}
                  variant='black-white'
                />
              )}
            </div>
          </section>
          <section className={cnPagePost('Content', ['mt-1', 'pb-14'])}>
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
