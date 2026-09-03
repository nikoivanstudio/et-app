import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import styles from '../assets/styles.module.scss';

const cnCardDates = cnBem('CardDates');

type CardDatesProps = {
  startTime: Date;
  finishTime: Date;
};

export const CardDates: FC<CardDatesProps> = ({ startTime, finishTime }) => (
  <div className={cnCardDates(null, ['text-[22px]', styles.CardDates])}>
    {('0' + startTime.getDate()).slice(-2)}–
    {('0' + finishTime.getDate()).slice(-2)}
  </div>
);
