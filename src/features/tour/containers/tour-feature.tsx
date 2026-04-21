'use client';

import { cn } from '@bem-react/classname';
import { FC, ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useCreateTour } from '@/features/tour/hooks/use-create-tour';
import { useEditTour } from '@/features/tour/hooks/use-edit-tour';
import { prepareDataUtils } from '@/features/tour/lib/prepare-data-utils';
import {
  createTourSchemas,
  editTourSchema
} from '@/features/tour/lib/schemas/create-tour-schemas';
import {
  createTour as createTourModel,
  initialCreateTourFormData
} from '@/features/tour/model/create-tour';

import { FormDialog, FormDialogDomain } from '@/entities/form-dialog';
import { TourDomain } from '@/entities/tour/server';

type Props =
  | {
      type: 'create';
      data?: TourDomain.TourEntity;
      title?: ReactNode;
      triggerBtn?: ReactNode;
      authorId: number;
    }
  | {
      type: 'edit';
      data: TourDomain.TourEntity;
      id: number;
      authorId: number;
      title?: ReactNode;
      triggerBtn?: ReactNode;
    };

const cnTourFeature = cn('TourFeature');

export const TourFeature: FC<Props> = ({
  type,
  data,
  title,
  triggerBtn,
  ...props
}) => {
  const [isOpen, setOpen] = useState(false);
  const [initialData, setInitialData] = useState<FormDialogDomain.FormData>(
    initialCreateTourFormData
  );

  if (type === 'edit' && !('id' in props || 'authorId' in props)) {
    throw new Error(
      'Ошибка. Обязательные данные для обновления тура не найдены'
    );
  }

  const isCreateType = type === 'create';
  const schema = isCreateType ? createTourSchemas : editTourSchema;
  const dialogTitle = title || (isCreateType ? 'Создать тур' : 'Редактировать тур');

  const onOpenChange = (value: boolean) => setOpen(value);
  const onClose = () => setOpen(false);
  const successHandler = () => {
    setOpen(false);
    toast.success(`Тур успешно ${isCreateType ? 'создан' : 'отредактирован'}`);
  };
  const errorHandler = (error: Error) => toast.error(error.message);

  const onCreate = useCreateTour({
    onSuccess: successHandler,
    onError: errorHandler
  });

  const onEdit = useEditTour({
    onSuccess: successHandler,
    onError: errorHandler,
    id: 'id' in props ? props.id : undefined,
    authorId: 'authorId' in props ? props.authorId : undefined
  });

  useEffect(() => {
    if (type === 'create' || !data) return;
    (async () => {
      const initialData = await prepareDataUtils.prepareDataToEdit(data);

      setInitialData(initialData);
    })();
  }, [data, type]);

  return (
    <div className={cnTourFeature(null, ['text-end'])}>
      <FormDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCancel={onClose}
        title={dialogTitle}
        triggerButton={triggerBtn || dialogTitle}
        formDataModel={createTourModel}
        initialData={{
          ...initialData,
          authorId: 'authorId' in props ? props.authorId : undefined
        }}
        onSubmit={isCreateType ? onCreate : onEdit}
        schema={schema}
        type={type === 'edit' ? 'patch' : 'put'}
      />
    </div>
  );
};
