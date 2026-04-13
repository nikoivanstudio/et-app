import { ActivityStatuses } from '@/entities/activity/server';

import { dbClient } from '@/shared/lib/db';

import { Activity } from '../../../../generated/prisma/client';

const getLastActivities = async (): Promise<Activity[]> => {
  return dbClient.activity.findMany({
    where: { status: { equals: ActivityStatuses.ACTIVE } },
    take: 4
  });
};

export const activitiesRepository = { getLastActivities };
