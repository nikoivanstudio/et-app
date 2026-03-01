import { queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/api-client';

import {
  FilesSearchParams,
  GetFileAuthorsResponse,
  GetFilesResponse
} from '../domain';

const authorsBaseKey = 'file-authors';
const authorsUrl = 'files/users';
const filesBaseKey = 'download-files';
const filesUrl = 'files/download';

const getFileAuthors = ({ signal }: { signal: AbortSignal }) =>
  apiClient.get<GetFileAuthorsResponse>({
    url: authorsUrl,
    signal
  });

const getFiles = ({
  signal,
  page,
  search,
  author,
  startDate,
  endDate
}: { signal: AbortSignal } & FilesSearchParams) =>
  apiClient.get<GetFilesResponse>({
    url: filesUrl,
    signal,
    queryParams: {
      page,
      ...(search ? { search } : {}),
      ...(author ? { author } : {}),
      ...(startDate ? { start_date: startDate } : {}),
      ...(endDate ? { end_date: endDate } : {})
    }
  });

const getFileAuthorsQueryOptions = () =>
  queryOptions({
    queryKey: [authorsBaseKey],
    queryFn: ({ signal }) => getFileAuthors({ signal })
  });

const getFilesQueryOptions = (params: FilesSearchParams) =>
  queryOptions({
    queryKey: [
      filesBaseKey,
      params.page,
      params.search ?? '',
      params.author ?? '',
      params.startDate ?? '',
      params.endDate ?? ''
    ],
    queryFn: ({ signal }) => getFiles({ signal, ...params })
  });

export const downloadFilesApi = {
  authorsBaseKey,
  filesBaseKey,
  getFileAuthors,
  getFiles,
  getFileAuthorsQueryOptions,
  getFilesQueryOptions
};
