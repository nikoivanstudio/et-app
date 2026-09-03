'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import styles from '../assets/styles.module.scss';

const cnCardPrice = cn('CardPrice');

export const CardPrice: FC<{ price: number }> = async ({ price }) => (
  <span
    className={cnCardPrice(null, ['whitespace-nowrap', styles.CardPrice])}
  >{`${price} ₽`}</span>
);
