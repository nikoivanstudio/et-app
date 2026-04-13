'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { PostDomain, ServerPostCard } from '@/entities/post/server';

type Props = {
  list: PostDomain.PostCardEntity[];
};

const cnPostCardList = cn('ServerPostCardList');

export const ServerPostCardList: FC<Props> = async ({ list }) => (
  <ul className={cnPostCardList(null, ['pt-15'])}>
    {list.map(card => (
      <li key={card.id}>
        <ServerPostCard {...card} />
      </li>
    ))}
  </ul>
);
