import { PostStatus } from '@/entities/post/domain';

import { Prisma } from '../../../../generated/prisma/client';
import PostWhereInput = Prisma.PostWhereInput;

const getValidStatus = (value: string): PostStatus =>
  value === 'legacy' || value === 'fresh' ? value : 'unknown';

const getSearchParamsUtils = (
  searchQuery: string | null
): { where: PostWhereInput } | undefined => {
  if (!searchQuery) {
    return;
  }

  return {
    where: {
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } },
        { metaTitle: { contains: searchQuery, mode: 'insensitive' } },
        { metaDescription: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }
  };
};

export const postUtils = { getValidStatus, getSearchParamsUtils };
