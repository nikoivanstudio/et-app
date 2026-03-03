'use client';

import { FC, Fragment } from 'react';

import { UploadFile } from '@/features/upload-file';

import type { SessionDomain } from '@/entities/user/server';

import { useFilesList } from '../hooks/use-files-list';
import { DownloadFilesLayout } from '../ui/layout';

type Props = {
  session: SessionDomain.SessionEntity;
};

export const FilesList: FC<Props> = ({ session }) => {
  const { files, footer, isLoading, errorMessage, searchPanel, pagination } =
    useFilesList();

  return (
    <>
      <UploadFile session={session} />
      <DownloadFilesLayout
        files={files}
        isLoading={isLoading}
        errorMessage={errorMessage}
        searchPanel={searchPanel}
        pagination={pagination}
      />
      {footer}
    </>
  );
};
