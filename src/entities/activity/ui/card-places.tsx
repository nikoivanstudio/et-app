'use server';

import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';
import { FC } from 'react';

const cnCardPlaces = cn('CardPlaces');

export const CardPlaces: FC<{ freePlaces: number }> = async ({
  freePlaces
}) => {
  const isTooMuchFreePlaces = freePlaces > 2;

  return (
    <span
      className={cnCardPlaces(null, [
        'rounded-2xl',
        'px-2',
        'pb-1',
        'text-xs',
        isTooMuchFreePlaces ? 'bg-green-700' : 'bg-red-800'
      ])}
    >
      {`${freePlaces} мест${pluralize(freePlaces, 'о', 'а', '')}`}
    </span>
  );
};
