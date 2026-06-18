'use client';

import {
  changePasswordAction,
  ChangePasswordFormState
} from '@/features/change-password/actions/change-password';
import { ChangePasswordFields } from '@/features/change-password/ui/change-password-fields';

import { useActionState } from '@/shared/lib/react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

export function ChangePasswordForm() {
  const [formState, action, isPending] = useActionState(
    changePasswordAction,
    {} as ChangePasswordFormState
  );

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle className='text-xl font-bold text-center'>
          Смена пароля
        </CardTitle>
        <CardDescription className='text-center'>
          Введите текущий и новый пароль
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className='space-y-4'>
          <ChangePasswordFields errors={formState.errors} />

          {formState.errors?._errors && (
            <Alert variant='destructive'>
              <AlertDescription>{formState.errors._errors}</AlertDescription>
            </Alert>
          )}

          {formState.success && (
            <Alert>
              <AlertDescription>Пароль успешно изменён</AlertDescription>
            </Alert>
          )}

          <Button disabled={isPending} type='submit' className='w-full'>
            Изменить пароль
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
