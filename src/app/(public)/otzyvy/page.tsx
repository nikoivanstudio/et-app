'use server';

import { FC } from 'react';

import { ServiceView } from '@/views/legacy/server';

const service = {
  id: 11,
  title: 'Отзывы — Джип туры и индивидуальные экскурсии по Крыму. Лучшие цены',
  content:
    'Отзывы — Джип туры и индивидуальные экскурсии по Крыму. Лучшие цены',
  mainImage:
    'https://energy-tur.ru/wp-content/uploads/2018/06/Hram-sv.luki.laki.jpg',
  images: []
};

const LegacyPage: FC = async () => <ServiceView {...service} />;

export default LegacyPage;
