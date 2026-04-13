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
    <span className='hover: cursor-pointer' onClick={onChange}>
      {isFavourite && !!id && !!secondId ? (
        <FilledHeartIcon id={id} />
      ) : (
        <>{!!secondId && <BlankHeartIcon id={secondId} />}</>
      )}
    </span>
  );
};
