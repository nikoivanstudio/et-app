'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';

import { PageHeadLayout } from '@/entities/page-head/ui/page-head-layout';
import { PageTitle } from '@/entities/page-title/ui/page-title';

import { YandexMap } from '@/views/contacts/ui/yandex-map';

export const ContactsView: FC = async () => (
  <>
    <AppMain
      mainHead={
        <PageHeadLayout
          className='pt-[35vh] px-4'
          title={<PageTitle topTitle={{ text: 'Контакты' }} />}
          content={null}
          page='tours'
        />
      }
      mainContent={
        <div className='p-4 max-w-full'>
          <YandexMap />
        </div>
      }
      mainBottom={null}
    />
  </>
);
