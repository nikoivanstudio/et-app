'use client';

import { cn } from '@bem-react/classname';
import { FC, useState } from 'react';
import { toast } from 'sonner';

import { useCreateTour } from '@/features/tour/hooks/use-create-tour';

import { FormDialog } from '@/entities/form-dialog';
import { FormDialogDomain } from '@/entities/form-dialog/index';
import { TourDomain } from '@/entities/tour/server';

import { createTourSchemas } from '../lib/schemas/create-tour-schemas';
import { createTour as createTourModel } from '../model/create-tour';

type Props = {
  data: TourDomain.TourEntity;
};

const cnCreateTourForm = cn('CreateTourForm');

export const EditTourModel: FC<Props> = ({ data }) => {
  const [isOpen, setOpen] = useState<boolean>();

  const onOpenChange = (value: boolean) => setOpen(value);
  const onClose = () => setOpen(false);
  const successHandler = () => {
    setOpen(false);
    toast.success('Тур успещно создан');
  };
  const errorHandler = (error: Error) => toast.error(error.message);

  const onSubmit = useCreateTour({
    onSuccess: successHandler,
    onError: errorHandler
  });

  return (
    <div className={cnCreateTourForm(null, ['text-center'])}>
      <FormDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCancel={onClose}
        title='Создать тур'
        triggerButton='Создать тур'
        formDataModel={createTourModel}
        initialData={data as unknown as FormDialogDomain.FormData}
        onSubmit={onSubmit}
        schema={createTourSchemas}
      />
    </div>
  );
};
