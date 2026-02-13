'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

const cnFilesLibraryHeader = cn('FilesLibraryHeader');

export const FilesLibraryHeader: FC = () => (
  <div className={cnFilesLibraryHeader(null, ['text-center', 'p-4'])}>
    <h2 className='text-2xl font-semibold tracking-tight'>Библиотека файлов</h2>
    <p className='text-muted-foreground text-sm'>
      Хранилище документов, изображений и служебных файлов.
    </p>
  </div>
);
