'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';
import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import { ServerContacts } from '@/entities/contacts/server';
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
          content={<ServerContacts {...CONTACTS} color='white' size={18} />}
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
