'use client';

import { FC } from 'react';

/**
 * Карта в карточке с радиусом и рамкой.
 * Было: `max-h-9/12` на обёртке и `height="720"` на самом iframe — на 1440
 * карта не отрисовывалась вообще, оставалась серая сетка во весь экран.
 */
export const YandexMap: FC = () => (
  <div className='border-rule rounded-card relative h-[260px] overflow-hidden border md:h-[360px]'>
    <iframe
      className='absolute inset-0 h-full w-full border-0'
      src='https://yandex.ru/map-widget/v1/?um=constructor%3A74a98f5ea7e6cc92fff70b30fa7dc44c4aaf841ed214817c3f9a5d8eedf7c4d4&source=constructor'
      title='Energy Tour на карте'
      loading='lazy'
    />
  </div>
);
