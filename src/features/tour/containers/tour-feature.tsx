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
  editTourWithTagsModel,
  initialCreateTourFormData
} from '@/features/tour/model/create-tour';
import { TourPreview } from '@/features/tour/ui/tour-preview';

import { FormDialog, FormDialogDomain } from '@/entities/form-dialog';
import { TourContent } from '@/entities/tour/model/content';
import { TourDomain } from '@/entities/tour/server';

type CommonProps = {
  title?: ReactNode;
  triggerBtn?: ReactNode;
  // Тур публикуется сразу (администратор) либо уходит на модерацию (гид).
  autoPublish?: boolean;
  // Показывать поле тегов (только модератору с правом assignTourTags).
  withTags?: boolean;
};

type Props = CommonProps &
  (
    | {
        type: 'create';
        data?: TourDomain.TourEntity;
        authorId: number;
      }
    | {
        type: 'edit';
        data: TourDomain.TourEntity;
        id: number;
        authorId: number;
      }
  );

const cnTourFeature = cn('TourFeature');

export const TourFeature: FC<Props> = ({
  type,
  data,
  title,
  triggerBtn,
  autoPublish,
  withTags,
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
  const formDataModel = withTags ? editTourWithTagsModel : createTourModel;
  const dialogTitle = title || (isCreateType ? 'Создать тур' : 'Редактировать тур');

  const onOpenChange = (value: boolean) => setOpen(value);
  const onClose = () => setOpen(false);
  const successHandler = () => {
    setOpen(false);

    if (isCreateType) {
      toast.success(
        autoPublish
          ? 'Тур создан и опубликован'
          : 'Тур отправлен на модерацию. Он появится в каталоге после одобрения'
      );

      return;
    }

    toast.success('Тур обновлён');
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
        formDataModel={formDataModel}
        initialData={{
          ...initialData,
          authorId: 'authorId' in props ? props.authorId : undefined
        }}
        onSubmit={isCreateType ? onCreate : onEdit}
        schema={schema}
        type={type === 'edit' ? 'patch' : 'put'}
        preview={formData => (
          <TourPreview
            title={
              typeof formData.title === 'string' ? formData.title : undefined
            }
            mainPhoto={formData.mainPhoto as string | File | (string | File)[]}
            price={formData.price as number | string}
            duration={formData.duration as number | string}
            content={formData.content as TourContent}
            photos={formData.photos as (string | File)[]}
          />
        )}
      />
    </div>
  );
};
