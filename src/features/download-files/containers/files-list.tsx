'use client';

import { FC } from 'react';

import type { SessionDomain } from '@/entities/user/server';

import { useFilesList } from '../hooks/use-files-list';
import { DownloadFilesLayout } from '../ui/layout';

type Props = {
  session: SessionDomain.SessionEntity;
  actions: FC<{ id: number }>[];
};

export const FilesList: FC<Props> = ({ session, actions }) => {
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
