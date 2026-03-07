'use client';

import { FC } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

import { useFileAuthors } from '../hooks/use-file-authors';
import { downloadFilesUtils } from '../lib/utils';

type Props = {
  value?: string;
  onSelect(value: string): void;
};

const RESET_AUTHOR_FILTER_VALUE = '__reset_author_filter__';

export const SearchAuthorsFilters: FC<Props> = ({ value, onSelect }) => {
  const { authors, isLoading, isError } = useFileAuthors();

  return (
    <Select
      value={value || undefined}
      onValueChange={nextValue =>
        onSelect(nextValue === RESET_AUTHOR_FILTER_VALUE ? '' : nextValue)
      }
    >
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Автор' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={RESET_AUTHOR_FILTER_VALUE}>Сбросить фильтр</SelectItem>
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
        {!isLoading && !isError && (
          <>
            {authors.map(author => (
              <SelectItem value={String(author.id)} key={author.id}>
                {downloadFilesUtils.getAuthorName(author)}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};
