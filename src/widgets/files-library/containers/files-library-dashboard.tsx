'use client';

import { FC } from 'react';

import { FilesLibraryLayout } from '@/widgets/files-library/ui/layout';

import { FilesList } from '@/features/download-files';

import { SessionDomain } from '@/entities/user/server';

import { FilesLibraryHeader } from '../ui/header';

type Props = {
  session: SessionDomain.SessionEntity;
};

export const FilesLibraryDashboard: FC<Props> = ({ session }) => {
  return (
    <FilesLibraryLayout
      header={<FilesLibraryHeader />}
      fileList={<FilesList session={session} />}
    />
  );
};
