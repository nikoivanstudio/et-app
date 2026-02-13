'use client';

import Image from 'next/image';
import { FC } from 'react';
import { UploadFileKind } from '../domain';

type Props = {
  file: File;
  kind: UploadFileKind;
};

export const PreviewContent: FC<Props> = ({ file, kind }) => {
  const url = URL.createObjectURL(file);

  const onLoadImage = () => URL.revokeObjectURL(url);

  return (
    <>
      {kind === 'image' && (
        <div className='bg-muted overflow-hidden rounded-md border'>
          <Image
            width={500}
            height={500}
            src={url}
            onLoad={onLoadImage}
            alt={file.name}
            className='h-36 w-full object-cover'
          />
        </div>
      )}
      {kind === 'video' && (
        <div className='bg-muted overflow-hidden rounded-md border'>
          <video
            className='h-36 w-full object-cover'
            controls
            src={file}
            preload='metadata'
          />
        </div>
      )}
      {kind === 'document' && (
        <div className='bg-muted text-muted-foreground flex h-36 items-center justify-center rounded-md border text-sm'>
          Превью недоступно
        </div>
      )}
    </>
  );
};
