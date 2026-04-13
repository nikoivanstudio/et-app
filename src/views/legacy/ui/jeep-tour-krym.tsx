'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';

import mainPhoto from '../assets/images/aQKuFKfMLbA.jpg';

import { Content } from './content';
import { Header } from './header';

export const JeepTourKrym: FC = async () => (
  <AppMain
    mainHead={<Header title='Джип туры в Крыму' mainPhoto={mainPhoto} />}
    mainContent={<Content />}
    mainBottom={null}
  />
);
