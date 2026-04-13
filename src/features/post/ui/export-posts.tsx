'use client';

import { DownloadCloudIcon } from 'lucide-react';
import { FC } from 'react';
import { toast } from 'sonner';

import { postApi } from '@/features/post/api/post-api';
import { exportUtils } from '@/features/post/lib/export-utils';

import { cn } from '@/shared/lib/css';
import { Button } from '@/shared/ui/button';

export const ExportPosts: FC = () => {
  const download = async () => {
    const response = await postApi.exportPosts();

    if (!response || !response.ok) {
      return toast.error('Ошибка экспорта постов');
    }

    const blob: Blob = await response.blob();

    exportUtils.downLoadExportFile(blob);
  };

  return (
    <div className={cn('text-center')}>
      <Button variant='ghost' onClick={download}>
        Экспорт постов
        <DownloadCloudIcon />
      </Button>
    </div>
  );
};
