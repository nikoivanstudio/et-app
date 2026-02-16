'use client';

import { cn } from '@bem-react/classname';
import { Upload } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';

import { SessionDomain } from '@/entities/user/server';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';
import { Spinner } from '@/shared/ui/spinner';

import { useUploadFiles } from '../hooks/use-upload-file';

import { ErrorInfo } from './error';
import { PreviewFilesList } from './preview-files-list';
import { UploadFileDialogContent } from './upload-file-dialog-content';
import { UploadInput } from './upload-input';

const cnUploadFile = cn('UploadFile');

type Props = {
  session: SessionDomain.SessionEntity;
};

export const UploadFile: FC<Props> = ({ session }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState('');
  const { fileItems, onChangeFiles, onDeleteItem, uploadFiles, isLoading } =
    useUploadFiles<Error>({
      userId: session.id,
      onSuccess: e => {
        setErrors(e);
        console.log({ e });
        toast.success(e);
        // setOpen(false);
      },
      onError: e => toast.error(e.message)
    });

  return (
    <div className={cnUploadFile(null, ['text-end'])}>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className='shrink-0'>
            <Upload className='size-4' />
            Загрузить файлы
          </Button>
        </DialogTrigger>

        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Загрузка файлов</DialogTitle>
            <DialogDescription>
              Выберите один или несколько файлов. После выбора появятся карточки
              с превью и метаинформацией. Размер одного файла не должен
              превышать 1Mb. Общее количество файлов за раз не более 10 шт.
            </DialogDescription>
          </DialogHeader>
          {isLoading && <Spinner />}
          <UploadFileDialogContent
            header={
              <>
                <UploadInput onChange={onChangeFiles} />
                <ErrorInfo />
                {!!errors && JSON.stringify(errors)}
              </>
            }
            list={
              <PreviewFilesList fileItems={fileItems} onDelete={onDeleteItem} />
            }
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Отмена</Button>
            </DialogClose>
            <Button
              onClick={uploadFiles}
              variant='outline'
              disabled={!fileItems.length}
            >
              Загрузить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
