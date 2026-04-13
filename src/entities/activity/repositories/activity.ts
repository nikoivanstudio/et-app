import { Activity, Prisma } from 'generated/prisma/client';

import { CreateActivityData } from '@/entities/activity/domain';

import { dbClient } from '@/shared/lib/db';

type Payload<T extends Prisma.ActivityFindManyArgs> =
  Prisma.ActivityGetPayload<T>;

const getCount = (where?: Prisma.ActivityWhereInput) =>
  dbClient.activity.count({ where });

const getActivities = <T extends Prisma.ActivityFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.ActivityFindManyArgs>
): Promise<Payload<T>[]> => dbClient.activity.findMany(args);

const getActivity = (id: number): Promise<Activity | null> =>
  dbClient.activity.findUnique({
    where: {
      id
    }
  });

const createActivity = (data: CreateActivityData & { authorId: number }) => {
  return dbClient.activity.create({ data });
};

const deleteActivity = async (id: number): Promise<Activity | null> =>
  dbClient.activity.delete({
    where: {
      id
    }
  });

export const activityRepositories = {
  getCount,
  getActivities,
  getActivity,
  createActivity,
  deleteActivity
};
