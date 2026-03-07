'use client';

import { FC } from 'react';

import { FilesLibraryLayout } from '@/widgets/files-library/ui/layout';

import { FilesList } from '@/features/download-files';

import { SessionDomain } from '@/entities/user/server';

import { FilesLibraryHeader } from '../ui/header';
import { UploadFile } from '@/features/upload-file';

type Props = {
  session: SessionDomain.SessionEntity;
};

export const FilesLibraryDashboard: FC<Props> = ({ session }) => {
  return (
    <FilesLibraryLayout
      header={<FilesLibraryHeader />}
      fileList={
        <>
          <UploadFile session={session} />
          <FilesList session={session} />
        </>
      }
    />
  );
};
