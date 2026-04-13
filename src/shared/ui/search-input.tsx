'use client';

import { cn } from '@bem-react/classname';
import { ChangeEvent, FC, useRef, useState } from 'react';

import { Input } from '@/shared/ui/input';

type Props = {
  onSearch(value: string): Promise<void> | void;
  searchValue?: string;
};

const cnSearchInput = cn('SearchInput');

export const SearchInput: FC<Props> = ({ onSearch, searchValue }) => {
  const [value, setValue] = useState<string>(searchValue || '');
  const timeout = useRef<NodeJS.Timeout>(null);

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setValue(value);

    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      onSearch(value);
      timeout.current = null;
    }, 700);
  };

  return (
    <div
      className={cnSearchInput('Search', ['text-center', 'text-lg', 'my-3'])}
    >
      <Input onChange={onChangeValue} value={value} placeholder='Поиск...' />
    </div>
  );
};
