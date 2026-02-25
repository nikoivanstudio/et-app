'use client';

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@radix-ui/react-select';
import { FC } from 'react';
import { Select } from 'react-day-picker';

export const SearchFilters: FC = () => {
  return (
    <Select>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Дата' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all-dates'>Все даты</SelectItem>
        <SelectItem value='today'>Сегодня</SelectItem>
        <SelectItem value='week'>Последние 7 дней</SelectItem>
        <SelectItem value='month'>Последние 30 дней</SelectItem>
      </SelectContent>
    </Select>
  );
};
