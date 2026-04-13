import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ActivityDate } from '@/widgets/activities/domain';
import { getMonthesTitle } from '@/widgets/activities/lib/dates-helpers';

type MonthsProps = {
  dates: ActivityDate[];
};

const cnMonths = cn('Months');

export const Months: FC<MonthsProps> = ({ dates }) => {
  const monthsTitle = getMonthesTitle(dates);

  return <span className={cnMonths(null, ['uppercase'])}>{monthsTitle}</span>;
};
