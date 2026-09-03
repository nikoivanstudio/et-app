'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ServerPostCardList } from '@/widgets/posts/ui/server-post-card-list';

import { Title } from '@/shared/ui/title';

import { postsServices } from '../services/posts-services';
import { Layout } from '../ui/layout';

const cnHomePosts = cn('HomePosts');

export const HomePosts: FC = async () => {
  const postCards = await postsServices.getPostCards({
    categories: {
      has: 'home'
    }
  });

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
      list={<ServerPostCardList list={postCards} />}
    />
  );
};
