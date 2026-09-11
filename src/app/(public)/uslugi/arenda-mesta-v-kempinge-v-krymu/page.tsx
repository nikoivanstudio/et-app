import { FC } from 'react';

import { ServiceView } from '@/views/legacy/server';

const service = {
  id: 1,
  slug: 'arenda-mesta-v-kempinge-v-krymu',
  title: 'Аренда места в кемпинге в Крыму',
  content:
    'Наша организация предоставляет возможность аренды места в кемпинге.\n' +
    '\n' +
    'Вам предоставляется возможность, разместить свою палатку на подготовленном месте в кемпинге <strong>Energy</strong><strong>-</strong><strong>Tur</strong>. Вместе с арендой места, вам предоставляется возможность пользоваться  общим душем, а также доступ к электро сети (220V). Расчет берется на 1 человека.\n' +
    '\n' +
    'Если же вы решили воспользоваться услугой прокат палатки и сопутствующего снаряжения у нас, то стоимость за пользованием места в кемпинге с вас не взымается.\n' +
    '\n' +
    'Стоимость аренды места в кемпинге по тарифу 150 рублей за 1 взрослого человека и 100 рублей за ребенка до 12 лет.\n' +
    '\n' +
    '<img class="alignnone size-medium wp-image-4017" src="https://energy-tur.ru/wp-content/uploads/2016/01/Lager-Energy-Tur-300x225.jpg" alt="Аренда места в кемпинге в Крыму" width="300" height="225" />',
  mainImage:
    'https://energy-tur.ru/wp-content/uploads/2016/01/Lager-Energy-Tur.jpg',
  images: []
};

export const dynamic = 'force-static';

const LegacyPage: FC = async () => <ServiceView {...service} />;

export default LegacyPage;
