import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Аренда места в кемпинге в Крыму',
  description:
    'Наша организация предоставляет возможность аренды места в кемпинге. Вам предоставляется возможность, разместить свою палатку на подготовленном месте в кемпинге Energy-Tur. Вместе с арендой места, вам предоставляется возможность пользоваться  общим душем, а также доступ к электро сети (220V). Расчет берется на 1 человека. Если же вы решили воспользоваться услугой  прокат палатки и сопутствующего снаряжения у нас, то стоимость за пользованием места в кемпинге с вас не взымается. Стоимость аренды места в кемпинге по тарифу 150 рублей за 1 взрослого человека и 100 рублей за ребенка до 12 лет.',
  path: '/uslugi/arenda-mesta-v-kempinge-v-krymu'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
