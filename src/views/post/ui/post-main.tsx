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
  const {
    id,
    title,
    image,
    content,
    metaDuration,
    metaPrice,
    price,
    duration
  } = props;

  return (
    <AppMain
      mainHead={<PageHeadPost {...{ id, title, mainPhoto: image }} />}
      mainContent={
        /* Контент поднимается на 32px и закрывает фото скруглением сверху —
           как на главной, странице тура и в каталоге. */
        <div
          className={cnPagePost('Content', [
            'bg-white',
            'rounded-t-[32px]',
            '-mt-8',
            'px-4',
            'pt-6',
            'pb-14',
            'md:px-6',
            'relative',
            'z-3'
          ])}
        >
          {/* Колонка та же, что у .et-post (720px), иначе на десктопе
              «Информация» и плитки статистики растягивались во всю ширину. */}
          <div className={cn('mx-auto', 'w-full', 'max-w-[720px]')}>
            <section className={cnPagePost('DescriptionBlock')}>
              <div className='flex items-center justify-between gap-4'>
                <span className={cn(styles.poiret_text_black, 'text-2xl')}>
                  Информация
                </span>
                <MockReviewsAvatars rating={4.9} />
              </div>
              <PostStats
                className='mt-4'
                priceValue={price}
                price={metaPrice}
                durationValue={duration}
                duration={metaDuration}
              />
            </section>
            <section className={cnPagePost('Body', ['mt-8'])}>
              <TextContent content={content as TrustedHTML} unstyled />
            </section>
          </div>
        </div>
      }
      mainBottom={null}
    />
  );
};
