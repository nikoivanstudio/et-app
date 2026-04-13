import { activitiesRepository } from '@/widgets/activities/repositories/activities';

import { ActivityDomain, secureUtils } from '@/entities/activity/server';

export const getUpcomingActivities = async (): Promise<
  ActivityDomain.ActivityEntity[]
> => {
  const activities = await activitiesRepository.getLastActivities();

  return activities
    .map(secureUtils.getSafeActivityEntity)
    .map(ActivityDomain.activityToActivityEntity);
};
