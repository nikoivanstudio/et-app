import { FC } from 'react';

import { ServiceView } from '@/views/legacy/server';

const service = {
  id: 4,
  slug: 'prokat-kvadrotsiklov-v-krymu',
  title: 'Прокат квадроциклов в Крыму',
  content:
    'У нас вы можете воспользоваться услугой <strong>прокат квадроциклов</strong> или заказать <strong><a href="https://energy-tur.ru/tury-na-kvadrotsiklah-v-krymu/">туры на квадроциклах</a></strong> по заданному маршруту.\n' +
    '\n' +
    'В прокате имеются 2-х местные квадроциклы с независимой подвеской и двигателем 500 куб см.\n' +
    '\n' +
    'Стоимость прокат квадроцикла осуществляется по цене <strong>1500 рублей</strong> в час. При аренде 4 и более квадроциклов предусмотрены скидки для группы. В стоимость входит сопровождение инструктором на отдельном квадроцикле.\n' +
    '\n' +
    'Но наиболее популярным способом <strong>проката квадроцикла</strong> является поездка по выбранному маршруту. Для этого у нас имеется огромный выбор ранее разработанных маршрутов, <strong>туры на квадроциклах.</strong>\n' +
    ' Также предлагаем вам воспользоваться нашими основными услугами <a href="https://energy-tur.ru/dzhip-tur-krym/">Джип туры по Крыму </a>\n' +
    '\n' +
    `(<a href='/tours'>Посмотреть все туры</a>)!`,
  // Фото для этой услуги в проекте нет: путь /images/… отдавал 404,
  // каталога public/images не существует. Шапка возьмёт запасной кадр.
  mainImage: null,
  images: []
};

export const dynamic = 'force-static';

const LegacyPage: FC = async () => <ServiceView {...service} />;

export default LegacyPage;
