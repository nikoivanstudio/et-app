'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { getActivitiesDates } from '@/widgets/activities/lib/dates-helpers';
import { getUpcomingActivities } from '@/widgets/activities/services/get-upcoming-activities';
import { ActivitiesLayout } from '@/widgets/activities/ui/activities-layout';
import { Months } from '@/widgets/activities/ui/months';

import { ActivityCard } from '@/entities/activity/server';

import { LinkButton } from '@/shared/ui/link-button';

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
              'leading-4',
              'text-center'
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
          {/* Было: одна строка «Предстоящих мероприятий нет» посреди фото и
              никакого следующего шага. */}
          {!upcomingActivities.length && (
            <div className='mx-auto mt-12 max-w-[520px] rounded-card border border-white/15 bg-white/8 px-5 py-8 text-center'>
              <p className='font-caladea text-base font-bold text-white'>
                Групповых выездов на ближайшие дни нет
              </p>
              <p className='font-caladea mt-2 text-[14.5px] leading-relaxed text-white/75'>
                Собираем группу под ваши даты — от четырёх человек выходит
                дешевле, чем в сборной группе.
              </p>
              <LinkButton className='mt-5 w-full md:w-[260px]' href='/tours'>
                Выбрать тур
              </LinkButton>
            </div>
          )}
        </div>
      }
    />
  );
};
