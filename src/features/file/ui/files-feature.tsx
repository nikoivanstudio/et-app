'use client';

import { FC, useEffect, useState } from 'react';
import { FileProps } from '@/entities/file/domain';
import { FileUploadMode } from '@/features/file/domain';
import { UploadMode } from '@/features/file/ui/upload-mode';
import { UploadFilesS3PresignedUrl } from '@/features/file/ui/upload-files-s3-presigned-url';
import { UploadFilesRouteUrl } from '@/features/file/ui/upload-files-route-url';
import { FileItemsList } from '@/features/file/ui/file-items-list';
import { apiClient } from '@/shared/api/api-client';

export const FilesFeature: FC = () => {
  const [files, setFiles] = useState<FileProps[]>([]);
  const [uploadMode, setUploadMode] =
    useState<FileUploadMode>('s3PresignedUrl');

  // Fetch files from the database
  const fetchFiles = async () => {
    const body = await apiClient.get<FileProps[]>({
      url: '/files',
      withoutParse: true
    });

    if (!body?.length) return;

    // set isDeleting to false for all files after fetching
    setFiles(body?.map(file => ({ ...file, isDeleting: false })));
  };

  // fetch files on the first render
  useEffect(() => {
    (async () => fetchFiles().catch(console.error))();
  }, []);

  const downloadUsingPresignedUrl = uploadMode === 's3PresignedUrl';

  const onChangeMode = (value: FileUploadMode) => {
    setUploadMode(value);
  };

  return (
    <div className='container flex flex-col gap-5 px-3'>
      <UploadMode value={uploadMode} onChange={onChangeMode} />
      {uploadMode === 's3PresignedUrl' ? (
        <UploadFilesS3PresignedUrl onUploadSuccess={fetchFiles} />
      ) : (
        <UploadFilesRouteUrl onUploadSuccess={fetchFiles} />
      )}
      <FileItemsList
        files={files}
        fetchFiles={fetchFiles}
        setFiles={setFiles}
        downloadUsingPresignedUrl={downloadUsingPresignedUrl}
      />
    </div>
  );
};
