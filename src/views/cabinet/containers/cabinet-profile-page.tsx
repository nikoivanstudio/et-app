import { FC } from 'react';

import { CabinetShell } from '@/widgets/guide-cabinet/server';

import { GuideProfileForm } from '@/features/cabinet';
import {
  CabinetBadges,
  CabinetIdentity,
  CabinetSession,
  GuideProfileData
} from '@/features/cabinet/server';

import type { CityOption } from '@/entities/city/domain';

export const CabinetProfilePage: FC<{
  identity: CabinetIdentity;
  badges: CabinetBadges;
  profile: GuideProfileData;
  sessions: CabinetSession[];
  cities: CityOption[];
}> = ({ identity, badges, profile, sessions, cities }) => (
  <CabinetShell
    identity={identity}
    badges={badges}
    section='profile'
    title='Профиль'
    subtitle='Всё, что клиент видит о вас до заявки, и всё, чем вы управляете после: контакты, письма и вход в кабинет.'
  >
    <GuideProfileForm profile={profile} sessions={sessions} cities={cities} />
  </CabinetShell>
);
