'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import {
  createActivityFormModel,
  initialCreateActivityFormData
} from '@/widgets/activities/model/create-activity';

import { createActivity } from '@/features/activity/api/activity-api';

import { createActivitySchema } from '@/entities/activity/server';
import { FormDialog, FormDialogDomain } from '@/entities/form-dialog';

const cnCreateActivityForm = cn('CreateActivityForm');

export const CreateActivityForm: FC = () => {
  const onSubmit = async (data: FormDialogDomain.FormData) => {
    const createActivityData = createActivitySchema.safeParse(data);

    if (!createActivityData.success) {
      throw new Error('Ошибка повторной валидации активности');
    }

    await createActivity(createActivityData.data);
  };

  return (
    <FormDialog
      className={cnCreateActivityForm()}
      triggerButton='Создать активность'
      formDataModel={createActivityFormModel}
      initialData={initialCreateActivityFormData}
      onSubmit={onSubmit}
      schema={createActivitySchema}
    />
  );
};
