'use client';

import { Trash2 } from 'lucide-react';
import { FC } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/entities/confirm-dialog';

import { Button } from '@/shared/ui/button';

import { useDeleteFile } from '../hooks/use-delete-file';

export const DeleteFile: FC<{ id: number }> = ({ id }) => {
  const successHandler = () => toast.success('Файл удален успешно');
  const errorHandler = () => toast.error('Ошибка. Не удалось удалить файл');
  const onDelete = useDeleteFile<Error>({
    id,
    onSuccess: successHandler,
    onError: errorHandler
  });

  return (
    <ConfirmDialog
      title='Удаление файла'
      description='Вы уверенны, что хотите удалить этот файл? Это может повлечь повреждение данных'
      triggger={
        <Button
          aria-label='Удалить файл'
          size='icon'
          variant='ghost'
        >
          <Trash2 className='size-4' />
        </Button>
      }
      onSubmit={onDelete}
    />
  );
};
