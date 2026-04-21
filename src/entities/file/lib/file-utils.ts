import { v4 } from 'uuid';

import { UploadFileKind } from '../domain';

const getUniqueFileName = (originalName: string): string =>
  `${v4()}-${originalName}`;

const getFileKind = (file: Pick<File, 'type'>): UploadFileKind => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';

  return 'document';
};

const getFileSource = (filename: string): string =>
  `/api/files/content/${encodeURIComponent(filename)}`;

export const fileUtils = {
  getUniqueFileName,
  getFileKind,
  getFileSource
};
