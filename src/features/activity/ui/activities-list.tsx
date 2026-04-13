'use client';

import { cn } from '@bem-react/classname';

import { useActivityList } from '@/features/activity/hooks/use-activity-list';

import { ActivityFeature } from '../containers/activity-feature';

const cnActivitiesList = cn('ActivitiesList');

export const ActivitiesList = () => {
  const { data, isFetching, tools, cursor } = useActivityList();

  return (
    <>
      {tools}
      <ul className={cnActivitiesList(null, [isFetching ? 'opacity-30' : ''])}>
        {data?.activities.map(item => (
          <li key={item.id}>
            <ActivityFeature {...item} />
          </li>
        ))}
      </ul>
      {cursor}
    </>
  );
};
