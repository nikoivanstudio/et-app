'use client';

import { Separator } from '@radix-ui/react-select';
import { Badge, Trash2 } from 'lucide-react';
import { FC, ReactNode } from 'react';
import { Button } from 'react-day-picker';

import { SessionDomain } from '@/entities/user/server';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

type Props = { searchPanel: ReactNode; session: SessionDomain.SessionEntity };

export const DownloadFilesLayout: FC<Props> = ({ session, searchPanel }) => {
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

            {mockFiles.map((file, index) => (
              <div key={file.id}>
                <div className='grid grid-cols-[1.6fr_0.6fr_1fr_0.8fr_0.6fr_auto] items-center gap-4 px-4 py-3 text-sm'>
                  <span className='font-medium'>{file.name}</span>
                  <Badge variant='outline'>{file.type}</Badge>
                  <span>{file.author}</span>
                  <span>{file.date}</span>
                  <span>{file.size}</span>
                  <div className='flex justify-end'>
                    <Button
                      aria-label={`Удалить файл ${file.name}`}
                      size='icon'
                      variant='ghost'
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>
                {index < mockFiles.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
