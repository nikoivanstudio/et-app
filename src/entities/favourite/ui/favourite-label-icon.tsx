'use client';

import { FC, useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { BlankHeartIcon } from '@/shared/ui/blank-heart-icon';
import { FilledHeartIcon } from '@/shared/ui/filled-heart-icon';

type FavouriteLabelIconProps = {
  isFavourite: boolean;
  onChange(): void;
};

export const FavouriteLabelIcon: FC<FavouriteLabelIconProps> = ({
  isFavourite,
  onChange
}) => {
  const [id, setId] = useState<string | null>(null);
  const [secondId, setSecondId] = useState<string | null>(null);

  const changeIds = () => {
    setId(v4());
    setSecondId(v4());
  };

  useEffect(() => {
    if (!id && !secondId) {
      setTimeout(changeIds, 0);
    }
  }, []);

  return (
    // Была <span onClick> — с клавиатуры недоступна и без имени для скринридера.
    <button
      type='button'
      className='flex items-center justify-center w-11 h-11 cursor-pointer'
      aria-pressed={isFavourite}
      aria-label={isFavourite ? 'Убрать из избранного' : 'В избранное'}
      onClick={onChange}
    >
      {isFavourite && !!id && !!secondId ? (
        <FilledHeartIcon id={id} />
      ) : (
        <>{!!secondId && <BlankHeartIcon id={secondId} />}</>
      )}
    </button>
  );
};
