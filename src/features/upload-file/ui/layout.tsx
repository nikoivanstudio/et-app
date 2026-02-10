'use client';

import { SessionDomain } from '@/entities/user/server';
import { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Button } from '@/shared/ui/button';
import { Upload } from 'lucide-react';

const cnUploadFile = cn('UploadFile');

export const UploadFileLayout: FC<{
  session: SessionDomain.SessionEntity;
}> = ({ session }) => {
  return (
    <div className={cnUploadFile()}>
      <Button variant='outline'>
        <Upload />
        <span className='pl3'>Загрузить файлы</span>
      </Button>
    </div>
  );
};
