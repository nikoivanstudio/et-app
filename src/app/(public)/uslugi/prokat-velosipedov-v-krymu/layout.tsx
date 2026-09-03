import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Прокат велосипедов в Крыму',
  description: `У нас вы можете воспользоваться услугой <strong>прокат велосипедов</strong>. В прокате имеются велосипеды различных размеров. Для индивидуального подбора под рост человека.  Предоставляется на условиях:

- Залог за велосипед. Документы или денежный залог в сумме 30 000 рублей за каждый велосипед.

- Залог за ремонт. Денежная сумма в размере 1000 рублей. Взымается на случай повреждения арендуемого оборудования. При отсутствии повреждений возвращается в полном объеме.

Стоимость аренды велосипеда:
<table>
<tbody>
<tr>
<td>Время аренды</td>
<td>Цена за единицу измерения</td>
</tr>
<tr>
<td>1 час</td>
<td>100 руб/час</td>
</tr>
<tr>
<td>1 день (С утра и до вечера)</td>
<td>500 руб/день</td>
</tr>
<tr>
<td>24 часа</td>
<td>600 руб/сутки</td>
</tr>
</tbody>
</table>

При аренде свыше 5 единиц времени, скидка 20%. Т.е. каждый 6-й час, день, сутки – бесплатные.

Также дополнительно можно воспользоваться прокатом сопутствующего снаряжения. Информацию уточняйте у оператора.

<img class="alignnone size-medium wp-image-4001" src="https://energy-tur.ru/wp-content/uploads/2016/01/velosiped-300x177.jpg" alt="Прокат велосипедов в Крыму" width="300" height="177" />`,
  path: '/uslugi/prokat-velosipedov-v-krymu'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
