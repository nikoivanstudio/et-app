'use client';

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@radix-ui/react-select';
import { ChangeEvent, FC } from 'react';
import { Select } from 'react-day-picker';

import { searchFilterTypes } from '../constants/filters-constants';

type Props = {
  onSelect(value: string): void;
  value?: string;
};

export const SearchTypesFilter: FC<Props> = ({ value, onSelect }) => {
  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    console.log({ value });

    onSelect(value);
  };

  return (
    <Select value={value} onSelect={handleSelect}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Тип файла' />
      </SelectTrigger>
      <SelectContent>
        {searchFilterTypes.map(({ title, value }, idx) => (
          <SelectItem value={value} key={idx}>
            {title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
