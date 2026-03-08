'use client';

import { Download } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

import { FileListItem } from '../domain';
import { FileItem } from './file-item';
import { DeleteFile } from '@/features/delete-files';

type Props = {
  searchPanel: ReactNode;
  pagination?: ReactNode;
  files: FileListItem[];
  actions: FC<{ id: number }>[];
  isLoading?: boolean;
  errorMessage?: string;
};

export const DownloadFilesLayout: FC<Props> = ({
  searchPanel,
  pagination,
  files,
  actions,
  isLoading,
  errorMessage
}) => {
  return (
    <Card>
      <CardHeader className='gap-3'>
        <CardTitle>Файлы</CardTitle>
        <CardDescription>
          Используйте фильтры, чтобы быстро найти нужные материалы.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-5'>
          {searchPanel}
        </div>

        <div className='overflow-x-auto rounded-lg border'>
          <div className='min-w-[760px]'>
            <div className='text-muted-foreground grid grid-cols-[1.6fr_0.6fr_1fr_0.8fr_0.6fr_auto] items-center gap-4 px-4 py-3 text-xs uppercase tracking-wide'>
              <span>Наименование</span>
              <span>Тип</span>
              <span>Автор</span>
              <span>Дата</span>
              <span>Размер</span>
              <span className='text-right'>Действия</span>
            </div>
            <Separator />

            {isLoading ? (
              <div className='px-4 py-6 text-sm text-muted-foreground'>
                Загрузка файлов...
              </div>
            ) : errorMessage ? (
              <div className='px-4 py-6 text-sm text-destructive'>
                {errorMessage}
              </div>
            ) : !files.length ? (
              <div className='px-4 py-6 text-sm text-muted-foreground'>
                Файлы не найдены
              </div>
            ) : (
              files.map((file, index) => (
                <FileItem
                  file={file}
                  filesLength={files.length}
                  index={index}
                  key={file.id}
                  actions={actions}
                />
              ))
            )}
          </div>
        </div>
        {pagination}
      </CardContent>
    </Card>
  );
};
