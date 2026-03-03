'use client';

import {
  type ReactNode,
  startTransition,
  useEffect,
  useRef,
  useState
} from 'react';

import {
  initialQueryParams,
  initialSearchState
} from '../constants/initial-constants';
import { SEARCH_DELAY } from '../constants/settings';
import { FilesSearchParams, SearchState } from '../domain';
import { downloadFilesUtils } from '../lib/utils';
import { FilesPagination } from '../ui/files-pagination';
import { FilesSummary } from '../ui/files-summary';
import { SearchAuthorsFilters } from '../ui/search-authors-filters';
import { SearchFilters } from '../ui/search-filters';
import { SearchPanel } from '../ui/search-panel';
import { SearchTypesFilter } from '../ui/search-types-filter';

import { useFileAuthors } from './use-file-authors';
import { useFiles } from './use-files';

const getQueryParams = (
  searchState: SearchState,
  page: number
): FilesSearchParams => {
  const { startDate, endDate } = downloadFilesUtils.getDateRange(
    searchState.date
  );

  return {
    page,
    ...(searchState.value ? { search: searchState.value } : {}),
    ...(searchState.author ? { author: searchState.author } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {})
  };
};

type UseFilesListResult = {
  errorMessage?: string;
  files: ReturnType<typeof downloadFilesUtils.prepareFiles>;
  footer: ReactNode;
  isLoading: boolean;
  pagination: ReactNode;
  searchPanel: ReactNode;
};

export const useFilesList = (): UseFilesListResult => {
  const [page, setPage] = useState<number>(initialQueryParams.page);
  const [searchState, setSearchState] =
    useState<SearchState>(initialSearchState);
  const [queryParams, setQueryParams] =
    useState<FilesSearchParams>(initialQueryParams);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { authors } = useFileAuthors();
  const {
    files,
    pagesCount,
    summary,
    isLoading,
    isError,
    error,
    isFetching
  } = useFiles(queryParams);

  const scheduleSearch = (nextState: SearchState) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        setQueryParams(getQueryParams(nextState, 1));
      });
    }, SEARCH_DELAY);
  };

  const onFilterChange = (value: string, name: keyof SearchState) => {
    setPage(1);
    setSearchState(prev => {
      const nextState = { ...prev, [name]: value };

      scheduleSearch(nextState);

      return nextState;
    });
  };

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
    startTransition(() => {
      setQueryParams(getQueryParams(searchState, nextPage));
    });
  };

  const preparedFiles = downloadFilesUtils.prepareFiles(files, authors);

  const pagination =
    pagesCount > 1 ? (
      <FilesPagination
        currentPage={page}
        pagesCount={pagesCount}
        onPageChange={onPageChange}
      />
    ) : null;

  const footer = (
    <FilesSummary
      totalFiles={summary.totalFiles}
      totalSpace={downloadFilesUtils.formatFileSize(summary.totalSpace)}
    />
  );

  const searchPanel = (
    <>
      <SearchPanel
        value={searchState.value}
        onChange={(value: string) => onFilterChange(value, 'value')}
      />
      <SearchTypesFilter
        value={searchState.type}
        onSelect={(value: string) => onFilterChange(value, 'type')}
      />
      <SearchAuthorsFilters
        value={searchState.author}
        onSelect={value => onFilterChange(value, 'author')}
      />
      <SearchFilters
        value={searchState.date}
        onSelect={value => onFilterChange(value, 'date')}
      />
    </>
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  return {
    files: preparedFiles,
    footer,
    isLoading: isLoading || isFetching,
    errorMessage: isError ? error?.message || 'Ошибка загрузки файлов' : undefined,
    searchPanel,
    pagination
  };
};
