'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';
import { AllTours } from '@/widgets/tours/server';

import { PageHeadLayout } from '@/entities/page-head/server';
import { PageTitle } from '@/entities/page-title/server';

export const ToursView: FC = async () => (
  <>
    <AppMain
      mainHead={
        <PageHeadLayout
          className='pt-[35vh] px-4'
          title={<PageTitle topTitle={{ text: 'Все туры' }} />}
          content={null}
          page='tours'
        />
      }
      mainContent={
        <div className='mt-[-15vh]'>
          <AllTours />
        </div>
      }
      mainBottom={null}
    />
  </>
);
