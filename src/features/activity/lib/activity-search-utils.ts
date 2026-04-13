import { ActivityDomain, isActivityStatus } from '@/entities/activity/server';

import { Prisma } from '../../../../generated/prisma/client';

const getValidStatus = (value: string | null): ActivityDomain.ActivityStatus =>
  isActivityStatus(value) ? value : ActivityDomain.ActivityStatuses.REMOVED;

const getSearchParamsUtils = (
  searchQuery: string | null
): { where: Prisma.ActivityWhereInput } | undefined => {
  if (!searchQuery) {
    return;
  }

  return {
    where: {
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }
  };
};

export const activitySearchUtils = { getValidStatus, getSearchParamsUtils };
