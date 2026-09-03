'use server';

import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';
import { FC } from 'react';

import styles from '../assets/styles.module.scss';

const cnCardPlaces = cn('CardPlaces');

export const CardPlaces: FC<{ freePlaces: number }> = async ({
  freePlaces
}) => {
  const isTooMuchFreePlaces = freePlaces > 2;

  return (
    <span
      className={cnCardPlaces(null, [
        // Статусный чип, а не кнопка: радиус 8px, шрифт не переносится.
        'font-oswald inline-flex shrink-0 items-center rounded-lg px-2.5 py-0.5 whitespace-nowrap',
        isTooMuchFreePlaces
          ? 'bg-free-bg text-free-ink'
          : 'bg-alert-bg text-alert-ink',
        styles.CardPlaces
      ])}
    >
      {`${freePlaces} мест${pluralize(freePlaces, 'о', 'а', '')}`}
    </span>
  );
};
