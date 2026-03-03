'use client';

import { FC } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

type Props = {
  value?: string;
  onSelect(value: string): void;
};

export const SearchFilters: FC<Props> = ({ value, onSelect }) => {
  return (
    <Select value={value} onValueChange={onSelect}>
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
