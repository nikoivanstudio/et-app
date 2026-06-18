'use client';

import { useState } from 'react';

import { PartnerApplicationDomain } from '@/entities/partner-application';

import { useActionState } from '@/shared/lib/react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';

import {
  createApplicationAction,
  CreateApplicationFormState
} from '../actions/create-application';
import { PartnerTypeSelect } from '../ui/partner-type-select';

export function BecomePartnerForm() {
  const [formState, action, isPending] = useActionState(
    createApplicationAction,
    {} as CreateApplicationFormState
  );
  const [type, setType] =
    useState<PartnerApplicationDomain.PartnerApplicationType | ''>('');
  const [agreed, setAgreed] = useState(false);

  if (formState.success) {
    return (
      <Alert>
        <AlertDescription>
          Заявка успешно отправлена. Она появится у администратора на
          рассмотрении.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={action} className='space-y-6'>
      <div className='space-y-2'>
        <Label>Выберите, кем вы хотите стать</Label>
        <PartnerTypeSelect value={type} onChange={setType} />
        {formState.errors?.type && (
          <div className='text-sm text-destructive'>{formState.errors.type}</div>
        )}
      </div>

      <div className='flex items-start gap-3'>
        {/* Скрытое поле, чтобы согласие попало в FormData при отмеченном чекбоксе. */}
        {agreed && <input type='hidden' name='agreement' value='on' />}
        <Checkbox
          id='agreement'
          checked={agreed}
          onCheckedChange={value => setAgreed(value === true)}
        />
        <Label htmlFor='agreement' className='text-sm leading-snug'>
          Подтверждаю свое согласие на обработку данных и согласен с правилами
          компании
        </Label>
      </div>
      {formState.errors?.agreement && (
        <div className='text-sm text-destructive'>
          {formState.errors.agreement}
        </div>
      )}

      {formState.errors?._errors && (
        <Alert variant='destructive'>
          <AlertDescription>{formState.errors._errors}</AlertDescription>
        </Alert>
      )}

      <Button
        type='submit'
        className='w-full'
        disabled={isPending || !type || !agreed}
      >
        Отправить заявку
      </Button>
    </form>
  );
}
