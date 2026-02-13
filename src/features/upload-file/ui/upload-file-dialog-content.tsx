'use client';

import { cn } from '@bem-react/classname';
import { FC, ReactNode } from 'react';

type Props = {
  header: ReactNode;
  list: ReactNode;
};

const cnUploadFileDialogContent = cn('UploadFileDialogContent');

export const UploadFileDialogContent: FC<Props> = ({ header, list }) => (
  <div className={cnUploadFileDialogContent(null, ['space-y-4 min-h-70vh'])}>
    {header}
    {list}
  </div>
);
