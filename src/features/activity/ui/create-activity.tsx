'use client';

import { cn } from '@bem-react/classname';
import { FC, useState } from 'react';
import { toast } from 'sonner';

import { createActivitySchema } from '@/entities/activity/server';
import { FormDialog } from '@/entities/form-dialog';

import { useCreateActivity } from '../hooks/use-create-activity';
import {
  createActivityFormModel,
  initialCreateActivityFormData
} from '../model/create-activity';

const cnCreateActivity = cn('CreateActivity');

export const CreateActivity: FC = () => {
  const [isOpen, setOpen] = useState<boolean>();
  const onOpenChange = (value: boolean) => setOpen(value);
  const onClose = () => setOpen(false);
  const successHandler = () => {
    setOpen(false);
    toast.success('Активность успешно создана');
  };
  const errorHandler = (error: Error) => toast.error(error.message);

  const onSubmit = useCreateActivity({
    onSuccess: successHandler,
    onError: errorHandler
  });

  return (
    <FormDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onCancel={onClose}
      className={cnCreateActivity()}
      triggerButton='Создать активность'
      formDataModel={createActivityFormModel}
      initialData={initialCreateActivityFormData}
      onSubmit={onSubmit}
      schema={createActivitySchema}
    />
  );
};
