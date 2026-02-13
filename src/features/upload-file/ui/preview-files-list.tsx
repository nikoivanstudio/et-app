'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';
import { UploadFilePreviewItem } from '../domain';
import { UploadFilePreviewCard } from './upload-file-preview-card';

type Props = {
  fileItems: UploadFilePreviewItem[];
  onDelete(id: string): void;
};

const cnPreviewFilesList = cn('PreviewFilesList');

export const PreviewFilesList: FC<Props> = ({ fileItems, onDelete }) => (
  <ul className={cnPreviewFilesList()}>
    {!!fileItems.length && (
      <div className='grid max-h-[50vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2'>
        {fileItems.map((item, idx) => (
          <UploadFilePreviewCard {...item} onDelete={onDelete} key={idx} />
        ))}
      </div>
    )}
  </ul>
);
