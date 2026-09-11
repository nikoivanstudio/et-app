import { FC } from 'react';

import { ServiceView } from '@/views/legacy/server';

const service = {
  id: 2,
  slug: 'arenda-vnedorozhnika-s-voditelem-v-krymu',
  title: 'Аренда внедорожника с водителем в Крыму',
  content: `Вы можете арендовать внедорожник с водителем на заказ. В парке имеются различные внедорожники: Nissan Patrol, Mitsubishi Pajero, Mitsubishi L200, УАЗ. Все автомобили являются специально подготовленными к жесткому бездорожью и управляются профессиональными водителями.

Стоимость аренды внедорожника:
[su_table]
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td>Количество часов</td>
<td>Стоимость одного часа аренды</td>
</tr>
<tr>
<td>1 – 4 часа</td>
<td>3500 руб/час</td>
</tr>
<tr>
<td>5 – 8 часов</td>
<td>3000 руб/час</td>
</tr>
<tr>
<td>9 – 12 часов</td>
<td>2500 руб/час</td>
</tr>
<tr>
<td>Более 12 часов</td>
<td>Оговаривается индивидуально</td>
</tr>
</tbody>
</table>

Детали:

-  автомобили оборудованы экспедиционным багажником ( для перевозки крупногабаритного багажа)

- пассажирская вместимость автомобилей:

Nissan Patrol – 7 мест

Mitsubishi Pajero – 4-6 мест

Mitsubishi L200 – 4 места

УАЗ – 4-6 мест

В стоимость включено:
<ul>
\t<li>Аренда автомобиля</li>
\t<li>Топливо</li>
\t<li>Лесной и Туристический сбор</li>
\t<li>Услуги водителя-инструктора</li>
\t<li>Время простоя автомобиля (ожидание водителем в автомобиле)</li>
</ul>`,
  mainImage: 'https://energy-tur.ru/wp-content/uploads/2016/01/9qIjSNgwcz8.jpg',
  images: []
};

export const dynamic = 'force-static';

const LegacyPage: FC = async () => <ServiceView {...service} />;

export default LegacyPage;
