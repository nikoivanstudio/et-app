import { FilesUserEntity } from '@/entities/file/domain';

import { ContentFile } from '../domain';

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

const getAuthorName = ({ login, firstName, lastName }: FilesUserEntity) =>
  [firstName, lastName].filter(Boolean).join(' ') || login;

const getFormattedAuthorName = (
  authorId: number,
  authors: FilesUserEntity[]
): string => {
  const author = authors.find(item => item.id === authorId);

  if (!author) {
    return `ID ${authorId}`;
  }

  return (
    [author.firstName, author.lastName].filter(Boolean).join(' ') ||
    author.login
  );
};

const prepareFile = (file: ContentFile, authors: FilesUserEntity[]) => ({
  id: file.id,
  name: file.originalName,
  type: file.type.toUpperCase(),
  author: downloadFilesUtils.getFormattedAuthorName(file.authorId, authors),
  date: new Date(file.createdAt).toLocaleDateString('ru-RU'),
  size: downloadFilesUtils.formatFileSize(file.size),
  url: file.url
});

const prepareFiles = (files: ContentFile[], authors: FilesUserEntity[]) =>
  files.map(file => prepareFile(file, authors));

export const downloadFilesUtils = {
  getAuthorName,
  getFormattedAuthorName,
  formatFileSize,
  getDateRange,
  prepareFiles
};
