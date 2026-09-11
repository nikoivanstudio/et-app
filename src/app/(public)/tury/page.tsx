import { FC } from 'react';

import { ServiceView } from '@/views/legacy/server';

const service = {
  id: 11,
  slug: 'tury',
  title: 'Туры',
  // Было: 'список туров в виде пиктограмм' — заметка разработчика, которая
  // уехала в прод и печаталась в теле страницы. Описание раздела теперь
  // лежит в SERVICE_DETAILS, здесь текста статьи нет.
  content: '',
  mainImage: 'https://energy-tur.ru/wp-content/uploads/2018/06/bg_jeep.png',
  images: []
};

export const dynamic = 'force-static';

const LegacyPage: FC = async () => <ServiceView {...service} />;

export default LegacyPage;
