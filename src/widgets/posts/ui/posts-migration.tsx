'use client';

import { cn } from '@bem-react/classname';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';

import { postApi } from '@/features/post/api/post-api';
import { createPostsFormModel } from '@/features/post/model/create-posts-model';

import { FormDialog, FormDialogDomain } from '@/entities/form-dialog';

const cnMigrationPosts = cn('MigrationPosts');

export const MigrationPosts: FC = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const onOpenChange = (value: boolean): void => setOpen(value);

  const onSubmit = async (data: FormDialogDomain.FormData) => {
    if (!data.files || !Array.isArray(data.files)) {
      return;
    }

    const formData = new FormData();

    formData.append('posts_file', data.files[0]);

    const result = await postApi.createPostsByFile<string>(formData);

    if (!result) {
      toast.error('Не удалось создать посты');

      return;
    }

    toast.success(String(result));

    onOpenChange(false);
  };

  return (
    <div className='text-center'>
      <FormDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={cnMigrationPosts()}
        triggerButton='Мигрировать посты из файла'
        formDataModel={createPostsFormModel}
        initialData={{ files: [] }}
        onSubmit={onSubmit}
        schema={z.object({ files: z.array(z.instanceof(File)) })}
      />
    </div>
  );
};
