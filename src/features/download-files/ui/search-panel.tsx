'use client';

import { Search } from 'lucide-react';
import { ChangeEvent, FC, useRef, useState } from 'react';

import { Input } from '@/shared/ui/input';

import { SEARCH_DELAY } from '../constants/settings';

type Props = {
  onSearch(value: string): void;
  onReset(): void;
};

export const SearchPanel: FC<Props> = ({ onSearch }) => {
  const [value, setValue] = useState<string>('');
  const ref = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }

    ref.current = setTimeout(() => onSearch(value), SEARCH_DELAY);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setValue(value);
    handleSearch(value);
  };

  return (
    <div className='relative xl:col-span-2'>
      <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
      <Input
        className='pl-9'
        placeholder='Поиск по названию файла'
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
