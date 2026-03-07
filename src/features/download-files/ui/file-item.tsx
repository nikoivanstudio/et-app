'use client';

import { Separator } from '@radix-ui/react-select';

import { FC } from 'react';

import { DeleteFile } from '@/features/delete-files';

import { FileListItem } from '../domain';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Download } from 'lucide-react';

type Props = { file: FileListItem; filesLength: number; index: number };

export const FileItem: FC<Props> = ({ file, filesLength, index }) => (
  <div key={file.id}>
    <div className='grid grid-cols-[1.6fr_0.6fr_1fr_0.8fr_0.6fr_auto] items-center gap-4 px-4 py-3 text-sm'>
      <span className='font-medium'>{file.name}</span>
      <Badge variant='outline'>{file.type}</Badge>
      <span>{file.author}</span>
      <span>{file.date}</span>
      <span>{file.size}</span>
      <div className='flex justify-end gap-1'>
        <Button
          asChild
          aria-label={`Скачать файл ${file.name}`}
          size='icon'
          variant='ghost'
        >
          <a href={file.url} target='_blank' rel='noreferrer'>
            <Download className='size-4' />
          </a>
        </Button>
        <DeleteFile id={file.id} />
      </div>
    </div>
    {index < filesLength - 1 ? <Separator /> : null}
  </div>
);
