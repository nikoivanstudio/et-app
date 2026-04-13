'use client';

import { FC } from 'react';

import { UploadFileKind } from '../domain';
import { validateFile } from '../model/validation/validation';

type Props = {
  file: File;
  kind: UploadFileKind;
};

export const PreviewValidationInfo: FC<Props> = ({ file, kind }) => {
  const validation = validateFile(file);

  return (
    <>
      {(validation.isTooLarge ||
        validation.isTypeInvalid ||
        (kind === 'image' && validation.isTooSmallImage)) && (
        <div className='space-y-1 text-xs'>
          {validation.isTooLarge && (
            <div className='text-destructive'>Размер файла превышает 1 MB</div>
          )}
          {kind === 'image' && validation.isTooSmallImage && (
            <div className='text-amber-600'>Фото некачественное</div>
          )}
          {validation.isTypeInvalid && (
            <div className='text-destructive'>Недопустимый тип файла</div>
          )}
        </div>
      )}
    </>
  );
};
