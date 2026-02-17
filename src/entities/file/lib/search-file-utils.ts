import { PostStatus } from '@/entities/post/domain';
import { Prisma } from '../../../../generated/prisma/client';
import FileWhereInput = Prisma.FileWhereInput;

const getSearchParamsUtils = (
  searchQuery: string | null
): { where: FileWhereInput } | undefined => {
  if (!searchQuery) {
    return;
  }

  return {
    where: {
      originalName: { contains: searchQuery, mode: 'insensitive' }
    }
  };
};

const getAuthorParams = (
  authorId: string | null
): { where: FileWhereInput } | undefined => {
  if (!authorId) {
    return;
  }

  return {
    where: {
      authorId: +authorId
    }
  };
};

const getDateParams = (
  startDate: number | null,
  finishDate: number | null
): { where: FileWhereInput } | undefined => {
  if (!startDate && !finishDate) {
    return;
  }

  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(0, 0, 0, 0);

  const end = finishDate ? new Date(finishDate) : new Date();
  end.setDate(end.getDate() + 1);

  return {
    where: {
      createdAt: {
        gte: start,
        lt: end
      }
    }
  };
};

export const searchFileUtils = {
  getSearchParamsUtils,
  getAuthorParams,
  getDateParams
};
