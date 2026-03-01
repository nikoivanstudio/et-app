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
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching
  };
};
