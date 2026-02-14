import { FileDomain } from '@/entities/file/server';
import {
  FullUrlDto,
  ShortFileDto,
  UploadFileKind,
  UploadFilePreviewItem
} from '../domain';

const getFileKind = (file: File): UploadFileKind => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';

  return 'document';
};

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getExtension = (name: string): string => {
  const parts = name.split('.');

  if (parts.length <= 1) return 'без расширения';

  return parts.at(-1)?.toUpperCase() || 'без расширения';
};

const getShortFileDto = (fileItem: UploadFilePreviewItem): ShortFileDto => ({
  originalFileName: fileItem.file.name,
  size: fileItem.file.size
});

const fullFileDtoToCreateFileDto = (
  fileDto: FullUrlDto
): FileDomain.CreateFileDTO => ({
  filename: fileDto.fileNameInBucket,
  originalName: fileDto.originalFileName,
  bucket: 'wp-content',
  size: fileDto.size,
  type: fileDto.type,
  authorId: fileDto.authorId
});

export const fileUtils = {
  getFileKind,
  formatFileSize,
  getExtension,
  getShortFileDto,
  fullFileDtoToCreateFileDto
};
