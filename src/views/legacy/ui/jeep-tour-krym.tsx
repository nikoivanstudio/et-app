'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';

import mainPhoto from '../assets/images/aQKuFKfMLbA.jpg';

import { Content } from './content';
import { Header } from './header';
import { PriceBanner } from './price-banner';

export const JeepTourKrym: FC = async () => (
  <AppMain
    mainHead={<Header title='Джип туры в Крыму' mainPhoto={mainPhoto} />}
    mainContent={
      <>
        <div className='mx-auto max-w-[820px] px-4 pt-8'>
          <PriceBanner />
        </div>
        <Content />
      </>
    }
    mainBottom={null}
  />
);
