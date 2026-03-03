'use client';

import { FC } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

import { searchFilterTypes } from '../constants/filters-constants';

type Props = {
  onSelect(value: string): void;
  value?: string;
};

export const SearchTypesFilter: FC<Props> = ({ value, onSelect }) => {
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Тип файла' />
      </SelectTrigger>
      <SelectContent>
        {searchFilterTypes.map(({ title, value }) => (
          <SelectItem value={value} key={value || 'all'}>
            {title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
