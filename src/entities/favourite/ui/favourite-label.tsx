'use client';

import { cn } from '@bem-react/classname';
import { FC, useEffect, useState } from 'react';

import { isTourFavourite } from '@/entities/favourite/lib/helpers';
import {
  addTourToFavourites,
  getFavouriteTours,
  removeFromFavourite
} from '@/entities/favourite/services/client-service';
import { FavouriteLabelIcon } from '@/entities/favourite/ui/favourite-label-icon';

import { PropsWithClassNames } from '@/shared/model/types';

import styles from '../assets/styles.module.scss';

const cnFavouriteLabel = cn('FavouriteLabel');

type FavouriteLabelProps = {
  id: number;
};

export const FavouriteLabel: FC<FavouriteLabelProps & PropsWithClassNames> = ({
  id,
  className
}) => {
  const [isFavourite, setFavourite] = useState<boolean>(false);

  const onFavouriteChange = () => {
    const favouriteTours = getFavouriteTours();
    const includeCurrentId = favouriteTours.includes(id);

    if (includeCurrentId) {
      removeFromFavourite(id);
    } else {
      addTourToFavourites(id);
    }

    setFavourite(!isFavourite);
  };

  useEffect(() => {
    const isFavourite = isTourFavourite(id);

    setTimeout(() => setFavourite(isFavourite), 0);
  }, []);

  return (
    <div
      className={cnFavouriteLabel(null, [
        // Тап-таргет 44×44 вместо 38px, подложка плотнее стеклянной #ffffff1a.
        'flex items-center justify-center w-11 h-11 rounded-pill backdrop-blur-xs',
        className,
        styles.FavouriteLabel
      ])}
    >
      <FavouriteLabelIcon
        isFavourite={isFavourite}
        onChange={onFavouriteChange}
      />
    </div>
  );
};
