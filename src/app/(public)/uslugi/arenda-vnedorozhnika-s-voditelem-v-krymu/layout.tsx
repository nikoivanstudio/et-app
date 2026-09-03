import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Аренда внедорожника с водителем в Крыму',
  description:
    'Вы можете арендовать внедорожник с водителем на заказ. В парке имеются различные внедорожники: Nissan Patrol, Mitsubishi Pajero, Mitsubishi L200, УАЗ. Все автомобили являются специально подготовленными к жесткому бездорожью и управляются профессиональными водителями. Стоимость аренды внедорожника:  Детали: -  автомобили оборудованы экспедиционным багажником ( для перевозки крупногабаритного багажа) - пассажирская вместимость автомобилей: Nissan Patrol – 7 мест Mitsubishi Pajero – 4-6 мест Mitsubishi L200 – 4 места УАЗ – 4-6 мест В стоимость включено:   Аренда автомобиля Топливо Лесной и Туристический сбор Услуги водителя-инструктора Время простоя автомобиля (ожидание водителем в автомобиле)',
  path: '/uslugi/arenda-vnedorozhnika-s-voditelem-v-krymu'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
