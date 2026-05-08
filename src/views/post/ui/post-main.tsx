'use server';

import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';

import { MockReviewsAvatars } from '@/entities/mock-reviews-avatars';
import { PostDomain } from '@/entities/post/server';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';
import { TextContent } from '@/shared/ui/text-content';

import { PageHeadPost } from '@/views/post/ui/page-head-post';
import { PostStats } from '@/views/post/ui/post-stats';

const cnPagePost = cnBem('PagePost');

export const PostMain: FC<PostDomain.PostEntity> = async props => {
  const { id, title, image, content, metaDuration, metaPrice, price, duration } =
    props;

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
            <PostStats
              className={cn('mt-4', 'mx-2')}
              priceValue={price}
              price={metaPrice}
              durationValue={duration}
              duration={metaDuration}
            />
          </section>
          <section className={cnPagePost('Content', ['mt-4', 'pb-14'])}>
            <TextContent content={content as TrustedHTML} unstyled />
          </section>
        </div>
      }
      mainBottom={null}
    />
  );
};
