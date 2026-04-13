import {
  ActivityDomain,
  ActivityEntity,
  activityRepositories
} from '@/entities/activity/server';

import { Either, left, right } from '@/shared/lib/either';

import { Prisma } from '../../../../generated/prisma/client';

const createActivity = async (
  data: ActivityDomain.CreateActivityData & { authorId: number }
): Promise<ActivityEntity | null> => {
  const activity = await activityRepositories.createActivity(data);

  return activity ? ActivityDomain.activityToActivityEntity(activity) : null;
};

const getUserActivities = async ({
  authorId,
  ...params
}: Prisma.ActivityFindManyArgs & { authorId?: number }): Promise<
  Either<string, ActivityDomain.ActivityEntity[]>
> => {
  const where: Prisma.ActivityWhereInput = { authorId };
  const tourIncludes: Prisma.ActivityInclude = { photos: true };

  const tours = await activityRepositories.getActivities({
    where,
    include: tourIncludes,
    ...params
  });

  if (!tours) {
    return left('Ошибка при получение мероприятий');
  }

  const activityEntities: ActivityDomain.ActivityEntity[] = tours.length
    ? tours.map(ActivityDomain.activityToActivityEntity)
    : [];

  return right(activityEntities);
};

export const activityServices = { getUserActivities, createActivity };
