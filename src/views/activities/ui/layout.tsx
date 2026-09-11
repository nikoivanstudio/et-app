'use server';

import { FC } from 'react';

import { UpcomingActivities } from '@/widgets/activities/server';
import { AppHeader } from '@/widgets/app-header/containers/app-header';
import { AppMain } from '@/widgets/app-main/server';
import { PopularTours } from '@/widgets/tours/server';

import { SectionHead } from '@/entities/page-head/server';

/**
 * Ближайшие выезды.
 *
 * Было: шапка `pt-[35vh]` с тем же фото, что на /tours, /posts и /kontakty,
 * «БЛИЖАЙШИЕ ТУРЫ» золотом справа, под ней кнопка `href='tours'` (без слеша —
 * относительный путь вёл на /activities/tours), а контент поднят на −15vh.
 */
export const ActivitiesView: FC = async () => (
  <>
    <AppHeader variant='public' />
    <AppMain
      mainHead={
        <SectionHead
          page='activities'
          kicker='Группы с открытым набором'
          title='Ближайшие выезды'
          lead='Даты, на которые уже собирается группа. Не нашли свою — соберём выезд под вас.'
        />
      }
      mainContent={
        <div className='bg-page relative z-3 -mt-8 rounded-t-[32px] pt-10'>
          <PopularTours />
          <UpcomingActivities />
        </div>
      }
      mainBottom={null}
    />
  </>
);
