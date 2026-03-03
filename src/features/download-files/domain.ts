import type { FilesUserEntity } from '@/entities/file/domain';

import { File } from './../../../generated/prisma/client';

export type ContentFile = File & {
  url: string;
};

export type FilesSummary = {
  totalFiles: number;
  totalSpace: number;
};

export type GetFileAuthorsResponse = {
  authors: FilesUserEntity[];
};

export type GetFilesResponse = {
  files: ContentFile[];
  pagesCount: number;
  summary: FilesSummary;
};

export type SearchState = {
  value: string;
  type?: string;
  author?: string;
  date?: string;
};

export type FilesSearchParams = {
  page: number;
  search?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
};

export type FileListItem = {
  id: number;
  name: string;
  type: string;
  author: string;
  date: string;
  size: string;
  url: string;
};
