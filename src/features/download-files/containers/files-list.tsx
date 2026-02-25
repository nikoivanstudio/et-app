'use client';

import { FC, useRef, useState } from 'react';

import { SessionDomain } from '@/entities/user/server';

import { SEARCH_DELAY } from '../constants/settings';
import { DownloadFilesLayout } from '../ui/layout';
import { SearchAuthorsFilters } from '../ui/search-authors-filters';
import { SearchPanel } from '../ui/search-panel';
import { SearchTypesFilter } from '../ui/search-types-filter';

type SearchState = {
  value: string;
  type?: string;
  author?: string;
  date?: string;
};

const initialSearchState = {
  value: ''
};

type Props = {
  session: SessionDomain.SessionEntity;
};

export const FilesList: FC<Props> = ({ session }) => {
  const [searchState, setSearchState] =
    useState<SearchState>(initialSearchState);
  const ref = useRef<NodeJS.Timeout | null>(null);

  // TODO: Must be async callback
  const onSearch = (value: string, name: string) =>
    console.log({ value, name });

  const handleSearch = (value: string, name: string) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }

    ref.current = setTimeout(() => onSearch(value, name), SEARCH_DELAY);
  };

  const onChange = (value: string, name: string) => {
    setSearchState(prev => ({ ...prev, [name]: value }));
    handleSearch(value, name);
  };

  return (
    <DownloadFilesLayout
      session={session}
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
            authors={[]}
            value={searchState.author}
            onSelect={value => onChange(value, 'author')}
          />
        </>
      }
    />
  );
};
