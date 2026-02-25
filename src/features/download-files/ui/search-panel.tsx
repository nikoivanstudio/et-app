'use client';

import { Search } from 'lucide-react';
import { ChangeEvent, FC } from 'react';

import { Input } from '@/shared/ui/input';

type Props = {
  value: string;
  onChange(value: string): void;
};

export const SearchPanel: FC<Props> = ({ value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    onChange(value);
  };

  return (
    <div className='relative xl:col-span-2'>
      <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
      <Input
        className='pl-9'
        placeholder='Поиск по названию файла'
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
