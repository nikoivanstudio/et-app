import { FC } from 'react';

import { ServiceView } from '@/views/legacy/server';

const service = {
  id: 8,
  slug: 'prokat-palatki-v-krymu',
  title: 'Прокат палатки в Крыму',
  content:
    'У нас вы можете воспользоваться услугой проката походного снаряжения. Это прокат: палатки, спальный мешок и каримат.\n' +
    '\n' +
    '- Имеется различная вместимость палаток.\n' +
    '\n' +
    '- Спальный мешок предоставляется отдельно от каримата( коврика)\n' +
    '\n' +
    'Стоимость услуг:\n' +
    '\n' +
    '<table>\n' +
    '<tbody>\n' +
    '<tr>\n' +
    '<td>Услуга</td>\n' +
    '<td>Цена за 24 часа</td>\n' +
    '</tr>\n' +
    '<tr>\n' +
    '<td>Прокат спального мешка</td>\n' +
    '<td>200 рублей</td>\n' +
    '</tr>\n' +
    '<tr>\n' +
    '<td>Прокат каримата (коврик)</td>\n' +
    '<td>50 рублей</td>\n' +
    '</tr>\n' +
    '<tr>\n' +
    '<td>Прокат 2-х местной палатки</td>\n' +
    '<td>300 рублей</td>\n' +
    '</tr>\n' +
    '<tr>\n' +
    '<td>Прокат 3-х местной палатки</td>\n' +
    '<td>500 рублей</td>\n' +
    '</tr>\n' +
    '<tr>\n' +
    '<td>Прокат 4-х местной палатки</td>\n' +
    '<td>700 рублей</td>\n' +
    '</tr>\n' +
    '<tr>\n' +
    '<td>Прокат 6-ти  местной палатки</td>\n' +
    '<td>1000 рублей</td>\n' +
    '</tr>\n' +
    '</tbody>\n' +
    '</table>\n' +
    '\n' +
    '\n' +
    'Предоставляется на условиях:\n' +
    '\n' +
    '- Залог, документы или денежный залог в сумме:\n' +
    '\n' +
    '500 рублей - коврик\n' +
    '\n' +
    '2000 рублей – спальный мешок\n' +
    '\n' +
    '4 000 рублей – 2-х местная палатка\n' +
    '\n' +
    '6000 рублей – 3-х местная палатка\n' +
    '\n' +
    '8000 рублей – 4-х местная палатка\n' +
    '\n' +
    '15000 рублей – 6-ти местная палатка.\n' +
    '\n' +
    '- Залог за ремонт. Денежная сумма в размере 1000 рублей. Взымается на случай повреждения арендуемого оборудования. При отсутствии повреждений возвращается в полном объеме.\n' +
    '\n' +
    'Также рекомендуем воспользоваться нашими услугами <a href="https://energy-tur.ru/dzhip-tur-krym/">Джип туры по Крыму</a> которые оставят довольными даже самых притязательных туристов.\n' +
    '\n' +
    '<img class="alignnone size-medium wp-image-4005" src="https://energy-tur.ru/wp-content/uploads/2016/01/karimat-300x195.jpg" alt="прокат каримата в крыму" width="300" height="195" /><img class="alignnone size-medium wp-image-4006" src="https://energy-tur.ru/wp-content/uploads/2016/01/palatka2h-300x217.jpg" alt="прокат двухместной палатки в крыму" width="300" height="217" /><img class="alignnone size-medium wp-image-4007" src="https://energy-tur.ru/wp-content/uploads/2016/01/palatka4h-300x250.jpg" alt="прокат 4х местной палатки в крыму" width="300" height="250" /><img class="alignnone size-medium wp-image-4008" src="https://energy-tur.ru/wp-content/uploads/2016/01/spalnik-200x300.jpg" alt="прокат спальника в крыму" width="200" height="300" />',
  mainImage: 'https://energy-tur.ru/wp-content/uploads/2016/01/karimat.jpg',
  images: []
};

export const dynamic = 'force-static';

const LegacyPage: FC = async () => <ServiceView {...service} />;

export default LegacyPage;
