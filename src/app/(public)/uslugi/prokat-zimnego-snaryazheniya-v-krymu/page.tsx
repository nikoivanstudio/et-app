import { FC } from 'react';

import { ServiceView } from '@/views/legacy/server';

const service = {
  id: 7,
  slug: 'prokat-zimnego-snaryazheniya-v-krymu',
  title: 'Прокат зимнего снаряжения в Крыму',
  content: 'Прокат зимнего снаряжения в Крыму',
  // Фото для этой услуги в проекте нет: путь /images/… отдавал 404,
  // каталога public/images не существует. Шапка возьмёт запасной кадр.
  mainImage: null,
  images: []
};

export const dynamic = 'force-static';

const LegacyPage: FC = async () => <ServiceView {...service} />;

export default LegacyPage;
