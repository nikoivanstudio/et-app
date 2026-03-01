'use client';

import {
  FC,
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState
} from 'react';

import type { SessionDomain } from '@/entities/user/server';

import { SEARCH_DELAY } from '../constants/settings';
import { FileListItem, FilesSearchParams, SearchState } from '../domain';
import { useFileAuthors } from '../hooks/use-file-authors';
import { useFiles } from '../hooks/use-files';
import { DownloadFilesLayout } from '../ui/layout';
import { SearchAuthorsFilters } from '../ui/search-authors-filters';
import { SearchPanel } from '../ui/search-panel';
import { SearchTypesFilter } from '../ui/search-types-filter';

const initialSearchState: SearchState = {
  value: ''
};

const initialQueryParams: FilesSearchParams = {
  page: 1
};

type Props = {
  session: SessionDomain.SessionEntity;
};

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getDateRange = (date?: string) => {
  if (!date || date === 'all-dates') {
    return {};
  }

  const endDate = new Date();
  const startDate = new Date(endDate);

  if (date === 'today') {
    const currentDate = endDate.toISOString().slice(0, 10);

    return {
      startDate: currentDate,
      endDate: currentDate
    };
  }

  if (date === 'week') {
    startDate.setDate(endDate.getDate() - 7);
  }

  if (date === 'month') {
    startDate.setDate(endDate.getDate() - 30);
  }

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10)
  };
};

export const FilesList: FC<Props> = () => {
  const [searchState, setSearchState] = useState<SearchState>(initialSearchState);
  const [queryParams, setQueryParams] =
    useState<FilesSearchParams>(initialQueryParams);
  const ref = useRef<NodeJS.Timeout | null>(null);
  const { authors } = useFileAuthors();
  const { files, isLoading, isError, error, isFetching } = useFiles(queryParams);

  const onSearch = useEffectEvent((nextState: SearchState) => {
    const { startDate, endDate } = getDateRange(nextState.date);

    startTransition(() => {
      setQueryParams({
        page: 1,
        ...(nextState.value ? { search: nextState.value } : {}),
        ...(nextState.author ? { author: nextState.author } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {})
      });
    });
  });

  const handleSearch = (nextState: SearchState) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }

    ref.current = setTimeout(() => onSearch(nextState), SEARCH_DELAY);
  };

  const onChange = (value: string, name: keyof SearchState) => {
    setSearchState(prev => {
      const nextState = { ...prev, [name]: value };

      handleSearch(nextState);

      return nextState;
    });
  };

  useEffect(
    () => () => {
      if (ref.current) {
        window.clearTimeout(ref.current);
      }
    },
    []
  );

  const getAuthorName = (authorId: number) => {
    const author = authors.find(item => item.id === authorId);

    if (!author) {
      return `ID ${authorId}`;
    }

    return [author.firstName, author.lastName].filter(Boolean).join(' ') || author.login;
  };

  const preparedFiles: FileListItem[] = files.map(file => ({
    id: file.id,
    name: file.originalName,
    type: file.type.toUpperCase(),
    author: getAuthorName(file.authorId),
    date: new Date(file.createdAt).toLocaleDateString('ru-RU'),
    size: formatFileSize(file.size),
    url: file.url
  }));

  return (
    <DownloadFilesLayout
      files={preparedFiles}
      isLoading={isLoading || isFetching}
      errorMessage={
        isError ? error?.message || 'РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё С„Р°Р№Р»РѕРІ' : undefined
      }
      searchPanel={
        <>
          <SearchPanel
            value={searchState.value}
            onChange={(value: string) => onChange(value, 'value')}
          />
          <SearchTypesFilter
            value={searchState.type}
            onSelect={(value: string) => onChange(value, 'type')}
          />
          <SearchAuthorsFilters
            value={searchState.author}
            onSelect={value => onChange(value, 'author')}
          />
        </>
      }
    />
  );
};
