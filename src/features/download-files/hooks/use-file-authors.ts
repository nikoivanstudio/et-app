'use client';

import { useQuery } from '@tanstack/react-query';

import { downloadFilesApi } from '../api/download-files-api';

export const useFileAuthors = () => {
  const query = useQuery({
    ...downloadFilesApi.getFileAuthorsQueryOptions()
  });

  return {
    authors: query.data?.authors ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching
  };
};
