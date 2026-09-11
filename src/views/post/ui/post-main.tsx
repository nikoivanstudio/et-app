'use server';

import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';

import { PostDomain } from '@/entities/post/server';

import { cn } from '@/shared/lib/css';
import { postCrumbs } from '@/shared/lib/seo/breadcrumbs';
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
    duration,
    status
  } = props;

  return (
    <AppMain
      mainHead={
        <PageHeadPost
          {...{ id, title, mainPhoto: image }}
          crumbs={postCrumbs(title)}
        />
      }
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
            {/* Было: «Информация» и рядом мок «★ 4,9/5» с тремя стоковыми
                аватарами — рейтинг, который никто не ставил, на каждой
                странице сайта. */}
            <section className={cnPagePost('DescriptionBlock')}>
              <PostStats
                className=''
                priceValue={price}
                price={metaPrice}
                durationValue={duration}
                duration={metaDuration}
              />
            </section>
            <section className={cnPagePost('Body', ['mt-8'])}>
              {/* Тексты, перенесённые из WordPress, лежат одной строкой с
                  переносами — их разбираем на абзацы и списки. Посты нового
                  формата уже размечены и проходят как есть. */}
              <TextContent
                content={content as TrustedHTML}
                unstyled
                legacy={status === 'legacy'}
              />
            </section>
          </div>
        </div>
      }
      mainBottom={null}
    />
  );
};
