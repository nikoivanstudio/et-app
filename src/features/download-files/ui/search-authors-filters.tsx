'use client';

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@radix-ui/react-select';
import { ChangeEvent, FC } from 'react';
import { Select } from 'react-day-picker';

type Props = {
  authors: { name: string; id: string }[];
  value?: string;
  onSelect(value: string): void;
};

export const SearchAuthorsFilters: FC<Props> = ({
  authors,
  value,
  onSelect
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    onSelect(value);
  };

  return (
    <Select value={value} onSelect={handleChange}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Автор' />
      </SelectTrigger>
      <SelectContent>
        {authors.map(({ name, id }, idx) => (
          <SelectItem value={id} key={idx}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
