import { Prisma } from '../../../../generated/prisma/client';
import FileWhereInput = Prisma.FileWhereInput;

const getSearchParamsUtils = (
  searchQuery: string | null
): FileWhereInput | undefined => {
  if (!searchQuery) {
    return;
  }

  return {
    originalName: { contains: searchQuery, mode: 'insensitive' }
  };
};

const getAuthorParams = (
  authorId: string | null
): FileWhereInput | undefined => {
  if (!authorId) {
    return;
  }

  const parsedAuthorId = Number(authorId);

  if (!Number.isFinite(parsedAuthorId)) {
    return;
  }

  return {
    authorId: parsedAuthorId
  };
};

const getDateParams = (
  startDate: string | null,
  endDate: string | null
): FileWhereInput | undefined => {
  if (!startDate && !endDate) {
    return;
  }

  const parseDate = (value: string | null): Date | null => {
    if (!value) return null;

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed;
  };

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start && !end) {
    return;
  }

  const createdAt: Prisma.DateTimeFilter = {};

  if (start) {
    const rangeStart = new Date(start);
    rangeStart.setHours(0, 0, 0, 0);
    createdAt.gte = rangeStart;
  }

  if (end) {
    const rangeEnd = new Date(end);
    rangeEnd.setHours(0, 0, 0, 0);
    rangeEnd.setDate(rangeEnd.getDate() + 1);
    createdAt.lt = rangeEnd;
  }

  return {
    createdAt
  };
};

export const searchFileUtils = {
  getSearchParamsUtils,
  getAuthorParams,
  getDateParams
};
