'use client';

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
import { cn } from '@bem-react/classname';
import { Upload } from 'lucide-react';
import { ChangeEvent, FC, useState } from 'react';

import { toast } from 'sonner';
import { uploadFileApi } from '../api/upload-file-api';
import { FileDto, FullUrlDto, UploadFilePreviewItem } from '../domain';
import { fileUtils } from '../lib/file-utils';
import { validateFile } from '../model/validation/validation';
import { ErrorInfo } from './error';
import { PreviewFilesList } from './preview-files-list';
import { UploadFileDialogContent } from './upload-file-dialog-content';
import { UploadInput } from './upload-input';

const cnUploadFile = cn('UploadFile');

type Props = {
  session: SessionDomain.SessionEntity;
};

export const UploadFile: FC<Props> = ({ session }) => {
  const [isOpen, setOpen] = useState(false);
  const [fileItems, setItems] = useState<UploadFilePreviewItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>();

  const onChangeFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files?.length) return;

    const fileItems: UploadFilePreviewItem[] = [...files].map(file => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file
    }));

    setItems(prev => [...prev, ...fileItems]);
  };

  const onDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const uploadFiles = async () => {
    setLoading(true);

    const validFiles = [...fileItems].filter(
      ({ file }) => !Object.values(validateFile(file)).some(Boolean)
    );

    const shortFilesDtos = validFiles.map(fileUtils.getShortFileDto);

    const { presignedUrlsDto } =
      await uploadFileApi.getPresignedUrlsDto(shortFilesDtos);

    const filesDto: FileDto[] = presignedUrlsDto.map(dto => {
      const currentItem = validFiles.find(
        item =>
          dto.originalFileName === item.file.name && dto.size === item.file.size
      );

      if (!currentItem) {
        throw new Error('Ошибка логики. Совпадающие fileDto не найдено');
      }

      return { ...dto, ...currentItem };
    });

    const results = await Promise.all(
      filesDto.map(
        async dto => await uploadFileApi.uploadToS3(dto.url, dto.file)
      )
    );

    const unUploaded = results.filter(res => res.status !== 200);

    if (unUploaded.length) {
      setErrors('Ошибка при загрузке файлов!');

      return;
    }

    const fullFilesDto: FullUrlDto[] = filesDto.map(dto => ({
      ...dto,
      authorId: session.id,
      type: fileUtils.getFileKind(dto.file)
    }));

    const saveResult = await uploadFileApi.saveFilesInfo(fullFilesDto);

    if (saveResult.type === 'left') {
      toast.error(saveResult.result);
      setErrors(saveResult.result);
    }

    toast.success(saveResult.result);

    setLoading(true);
  };

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
          <UploadFileDialogContent
            header={
              <>
                <UploadInput onChange={onChangeFiles} />
                <ErrorInfo errors={errors} />
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
