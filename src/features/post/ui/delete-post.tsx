import { XCircle } from 'lucide-react';
import { FC } from 'react';
import { toast } from 'sonner';

import { useDeletePost } from '@/features/post/hooks/use-delete-post';

import { ConfirmDialog } from '@/entities/confirm-dialog';

import { Button } from '@/shared/ui/button';

export const DeletePost: FC<{ id: number }> = ({ id }) => {
  const successHandler = () => toast.success('Пост удален успешно');
  const errorHandler = () => toast.error('Ошибка. Не удалось удалить пост');
  const onDelete = useDeletePost<Error>({
    id,
    onSuccess: successHandler,
    onError: errorHandler
  });

  return (
    <ConfirmDialog
      title='Удаление тура'
      description='Вы уверенны, что хотите удалить этот тур?'
      triggger={
        <Button variant='ghost' size='sm'>
          <XCircle className='size-4' />
        </Button>
      }
      onSubmit={onDelete}
    />
  );
};
