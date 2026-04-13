import { PostDomain, postRepositories } from '@/entities/post/server';

import { dbQueryUtils } from '@/shared/lib/db-client-utils';
import { Either, left, right } from '@/shared/lib/either';

import { Prisma } from '../../../../generated/prisma/client';
import { postCardFields } from '../constants/request-constants';

type PaginatedPostCardsResponse = {
  list: PostDomain.PostCardEntity[];
  totalPages: number;
};

type PaginatedPostCardsConfig = {
  where?: Prisma.PostWhereInput;
  page?: string | number;
};

const getPostCards = (
  where?: Prisma.PostWhereInput
): PostDomain.PostCardEntity[] =>
  postRepositories.getPostsBySelect({
    where,
    select: postCardFields
  }) as unknown as PostDomain.PostCardEntity[];

const getPaginatedPostCards = async ({
  where,
  page
}: PaginatedPostCardsConfig): Promise<
  Either<string, PaginatedPostCardsResponse>
> => {
  const postsCount = await postRepositories.getPostsCount(where);

  const params = dbQueryUtils.getPageParams(page);

  const postCards = (await postRepositories.getPostsBySelect({
    where,
    select: postCardFields,
    ...params
  })) as unknown as PostDomain.PostCardEntity[];

  if (!postsCount || !postCards) {
    return left('Ошибка получения постов');
  }

  return right({ totalPages: Math.ceil(postsCount / 10), list: postCards });
};

export const postsServices = { getPostCards, getPaginatedPostCards };
