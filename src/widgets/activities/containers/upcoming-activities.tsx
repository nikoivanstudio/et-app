'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { getActivitiesDates } from '@/widgets/activities/lib/dates-helpers';
import { getUpcomingActivities } from '@/widgets/activities/services/get-upcoming-activities';
import { ActivitiesLayout } from '@/widgets/activities/ui/activities-layout';
import { Months } from '@/widgets/activities/ui/months';

import { ActivityCard } from '@/entities/activity/server';

import styles from '../assets/styles.module.scss';

const cnUpcomingActivities = cn('UpcomingActivities');

export const UpcomingActivities: FC = async () => {
  const upcomingActivities = await getUpcomingActivities();

  const activitiesDates = getActivitiesDates(upcomingActivities);

  return (
    <ActivitiesLayout
      className={cnUpcomingActivities({ type: 'server' }, [
        styles.UpcomingActivities
      ])}
      title='Ближайшие туры'
      content={
        <div className={cnUpcomingActivities('Content', 'p-1')}>
          <div
            className={cnUpcomingActivities('Description', [
              'mt-2',
              'leading-4'
            ])}
          >
            <span
              className={cnUpcomingActivities('DescriptionText', [
                styles.UpcomingActivities_DescriptionText,
                'text-xl',
                'whitespace-nowrap'
              ])}
            >
              выбирай свои даты на <Months dates={activitiesDates} />
            </span>
          </div>
          <ul className='flex flex-col gap-1.5'>
            {upcomingActivities.map(
              ({
                id,
                title,
                places,
                personPrice,
                startTime,
                finishTime,
                participants
              }) => (
                <li key={id}>
                  <ActivityCard
                    id={id}
                    title={title}
                    price={personPrice}
                    freePlaces={places - participants.length}
                    startTime={startTime}
                    finishTime={finishTime}
                  />
                </li>
              )
            )}
          </ul>
          {!upcomingActivities.length && (
            <span
              className={cnUpcomingActivities('EmptyBadge', [
                styles.UpcomingActivities_EmptyBadge,
                'text-2xl'
              ])}
            >
              Предстоящих мероприятий нет
            </span>
          )}
        </div>
      }
    />
  );
};
