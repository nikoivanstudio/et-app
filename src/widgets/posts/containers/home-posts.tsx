'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ServerPostCardList } from '@/widgets/posts/ui/server-post-card-list';

import { EmptyState } from '@/shared/ui/empty-state';
import { LinkButton } from '@/shared/ui/link-button';
import { Title } from '@/shared/ui/title';

import { postsServices } from '../services/posts-services';
import { Layout } from '../ui/layout';

const cnHomePosts = cn('HomePosts');

const HOME_POSTS_LIMIT = 3;

export const HomePosts: FC = async () => {
  const featured = await postsServices.getPostCards({
    categories: { has: 'home' }
  });

  /* Раньше блок показывал только посты с категорией `home`. Ни у одной
     записи её нет — на главной между заголовком и следующим блоком
     оставалась пустота. Нет отмеченных — показываем свежие. */
  const postCards = (
    featured.length ? featured : await postsServices.getPostCards()
  ).slice(0, HOME_POSTS_LIMIT);

  return (
    <Layout
      className={cnHomePosts(null, [
        'mx-auto max-w-[1120px] px-4 pt-20',
        'relative',
        'z-5'
      ])}
      title={
        <Title type='h2' className={cnHomePosts('Title', ['relative', 'z-3'])}>
          Открой для себя мир путешествий уже сегодня!
        </Title>
      }
      list={
        postCards.length ? (
          <div className='mt-10'>
            <ServerPostCardList list={postCards} />
          </div>
        ) : (
          <EmptyState
            className='mt-8'
            title='Статьи скоро появятся'
            text='Пока можно позвонить — расскажем про маршруты голосом и подберём даты.'
            action={
              <LinkButton className='w-full md:w-[260px]' href='/kontakty'>
                Связаться
              </LinkButton>
            }
          />
        )
      }
    />
  );
};
