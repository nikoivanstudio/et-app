'use client';

import { FC } from 'react';

import { useFilesList } from '../hooks/use-files-list';
import { DownloadFilesLayout } from '../ui/layout';

type Props = {
  actions: FC<{ id: number }>[];
};

export const FilesList: FC<Props> = ({ actions }) => {
  const { files, isLoading, errorMessage, searchPanel, pagination } =
    useFilesList();

  return (
    <DownloadFilesLayout
      files={files}
      actions={actions}
      isLoading={isLoading}
      errorMessage={errorMessage}
      searchPanel={searchPanel}
      pagination={pagination}
    />
  );
};
