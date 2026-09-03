'use client';

import { cn } from '@bem-react/classname';
import { Turnstile } from 'next-turnstile';
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

const CLOUDFLARE_SITE_KEY = process.env.NEXT_PUBLIC_CF_SITE_KEY || '';

export const ApplicationFormLayout: FC<Props> = ({
  triggerButton,
  appData
}) => {
  const onSubmit = async (
    data: FormDialogDomain.FormData,
    captchaToken?: string
  ) => {
    const formDataResult = applicationFormSchema.safeParse(data);

    if (!formDataResult.success) return;

    await sendCallbackRequest(formDataResult.data, appData, captchaToken);
  };

  return (
    <div className={cnApplicationForm()}>
      <FormDialog
        triggerButton={triggerButton || 'Заказать обратный звонок'}
        formDataModel={applicationFormModel}
        initialData={initialFormData}
        onSubmit={onSubmit}
        schema={applicationFormSchema}
        captcha={
          CLOUDFLARE_SITE_KEY ? (
            <Turnstile siteKey={CLOUDFLARE_SITE_KEY} theme='auto' />
          ) : null
        }
      />
    </div>
  );
};
