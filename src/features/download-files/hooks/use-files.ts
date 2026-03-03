'use client';

import { useQuery } from '@tanstack/react-query';

import { downloadFilesApi } from '../api/download-files-api';
import { FilesSearchParams } from '../domain';

export const useFiles = (params: FilesSearchParams) => {
  const query = useQuery({
    ...downloadFilesApi.getFilesQueryOptions(params)
  });

  return {
    files: query.data?.files ?? [],
    pagesCount: query.data?.pagesCount ?? 0,
    summary: query.data?.summary ?? { totalFiles: 0, totalSpace: 0 },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching
  };
};
