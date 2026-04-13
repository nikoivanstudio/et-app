'use client';

import { cn } from '@bem-react/classname';
import { FC, ReactNode } from 'react';

import { sendCallbackRequest } from '@/features/application-form/api/callback-api';
import { initialFormData } from '@/features/application-form/constants/initial-form-data';
import { ApplicationData } from '@/features/application-form/domain';
import { applicationFormModel } from '@/features/application-form/model/form-model';
import { applicationFormSchema } from '@/features/application-form/model/schema';

import { FormDialog, FormDialogDomain } from '@/entities/form-dialog';

type Props = {
  triggerButton?: ReactNode;
  appData?: ApplicationData;
};

const cnApplicationForm = cn('ApplicationForm');

export const ApplicationFormLayout: FC<Props> = ({
  triggerButton,
  appData
}) => {
  const onSubmit = async (data: FormDialogDomain.FormData) => {
    const formDataResult = applicationFormSchema.safeParse(data);

    if (!formDataResult.success) return;

    await sendCallbackRequest(formDataResult.data, appData);
  };

  return (
    <div className={cnApplicationForm()}>
      <FormDialog
        triggerButton={triggerButton || 'Заказать обратный звонок'}
        formDataModel={applicationFormModel}
        initialData={initialFormData}
        onSubmit={onSubmit}
        schema={applicationFormSchema}
      />
    </div>
  );
};
