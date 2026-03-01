'use client';

import { FC } from 'react';

import type { FilesUserEntity } from '@/entities/file/domain';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

import { useFileAuthors } from '../hooks/use-file-authors';

type Props = {
  value?: string;
  onSelect(value: string): void;
};

const getAuthorName = ({ login, firstName, lastName }: FilesUserEntity) =>
  [firstName, lastName].filter(Boolean).join(' ') || login;

export const SearchAuthorsFilters: FC<Props> = ({ value, onSelect }) => {
  const { authors, isLoading, isError } = useFileAuthors();

  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Автор' />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem value='loading' disabled>
            Загрузка...
          </SelectItem>
        )}
        {isError && (
          <SelectItem value='error' disabled>
            Не удалось загрузить авторов
          </SelectItem>
        )}
        {!isLoading && !isError && authors.length === 0 && (
          <SelectItem value='empty' disabled>
            Авторы не найдены
          </SelectItem>
        )}
        {!isLoading &&
          !isError &&
          authors.map(author => (
            <SelectItem value={String(author.id)} key={author.id}>
              {getAuthorName(author)}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
