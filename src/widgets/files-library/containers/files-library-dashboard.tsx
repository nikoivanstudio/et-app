'use client';

import { FC } from 'react';

import { FilesLibraryLayout } from '@/widgets/files-library/ui/layout';

import { DeleteFile } from '@/features/delete-files';
import { FilesList } from '@/features/download-files';
import { UploadFile } from '@/features/upload-file';

import { SessionDomain } from '@/entities/user/server';

import { FilesLibraryHeader } from '../ui/header';

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
          <FilesList session={session} actions={[DeleteFile]} />
        </>
      }
    />
  );
};
