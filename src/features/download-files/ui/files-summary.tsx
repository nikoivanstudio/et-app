'use client';

import { FC } from 'react';

import { Card, CardContent } from '@/shared/ui/card';

type Props = {
  totalFiles: number;
  totalSpace: string;
};

export const FilesSummary: FC<Props> = ({ totalFiles, totalSpace }) => {
  return (
    <Card>
      <CardContent className='grid gap-3 py-1 sm:grid-cols-2'>
        <div className='rounded-lg border p-4'>
          <p className='text-muted-foreground text-sm'>Файлов в хранилище</p>
          <p className='text-2xl font-semibold'>{totalFiles}</p>
        </div>
        <div className='rounded-lg border p-4'>
          <p className='text-muted-foreground text-sm'>Занято места</p>
          <p className='text-2xl font-semibold'>{totalSpace}</p>
        </div>
      </CardContent>
    </Card>
  );
};
