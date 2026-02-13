'use client';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@bem-react/classname';
import { Trash2 } from 'lucide-react';
import { FC } from 'react';
import { fileKindIcon, fileKindLabel } from '../constants/labels';
import { UploadFilePreviewItem } from '../domain';
import { fileUtils } from '../lib/file-utils';
import { validateFile } from '../model/validation/validation';
import { PreviewContent } from './content-preview';
import { PreviewValidationInfo } from './preview-validation-info';

type Props = UploadFilePreviewItem & {
  onDelete?: (id: string) => void;
};

const cnUploadFilePreviewCard = cn('UploadFilePreviewCard');

export const UploadFilePreviewCard: FC<Props> = ({ file, id, onDelete }) => {
  const kind = fileUtils.getFileKind(file);
  const sizeLabel = fileUtils.formatFileSize(file.size);
  const extension = fileUtils.getExtension(file.name);

  const validation = validateFile(file);
  const hasError = validation.isTooLarge || validation.isTypeInvalid;

  return (
    <Card
      className={cnUploadFilePreviewCard(null, [
        'gap-3 py-4',
        hasError ? 'border-destructive' : ''
      ])}
    >
      <CardHeader className='px-4'>
        <div className='flex items-start justify-between gap-3'>
          <CardTitle className='line-clamp-2 text-sm leading-5'>
            {file.name}
          </CardTitle>
          <Button
            aria-label={`Удалить файл ${file.name}`}
            onClick={() => onDelete?.(id)}
            size='icon'
            type='button'
            variant='ghost'
          >
            <Trash2 className='size-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-3 px-4'>
        <PreviewContent file={file} kind={kind} />
        <div className='flex items-center gap-2'>
          <Badge className='gap-1' variant='outline'>
            {fileKindIcon[kind]}
            {fileKindLabel[kind]}
          </Badge>
          <Badge variant='outline'>{extension}</Badge>
        </div>
        <PreviewValidationInfo file={file} kind={kind} />
        <dl className='grid grid-cols-2 gap-x-4 gap-y-1 text-xs'>
          <dt className='text-muted-foreground'>Размер</dt>
          <dd className='text-right'>{sizeLabel}</dd>
          <dt className='text-muted-foreground'>Тип файла</dt>
          <dd className='text-right'>{fileKindLabel[kind]}</dd>
        </dl>
      </CardContent>
    </Card>
  );
};
