'use client';

import { signInAction, SignInFormState } from '@/features/auth/actions/sign-in';
import { BottomLink } from '@/features/auth/ui/ilnk';

import { useActionState } from '@/shared/lib/react';

import { routes } from '@/kernel/routes';

import { AuthFormLayout } from '../ui/auth-form-layout';
import { AuthFields } from '../ui/fields';
import { SubmitButton } from '../ui/submit-button';
import { ErrorMessage } from '../ui/submit-button copy';

export function SignInForm() {
  const [formState, action, isPending] = useActionState(
    signInAction,
    {} as SignInFormState
  );

  return (
    <AuthFormLayout
      title='Вход'
      description='Доброе пожаловать!'
      action={action}
      fields={<AuthFields {...formState} type='signin' />}
      actions={<SubmitButton isPending={isPending}>Войти</SubmitButton>}
      error={<ErrorMessage error={formState.errors?._errors} />}
      link={
        <BottomLink
          text='Вы не зарегистрированы?'
          linkText='Регистрация'
          url={routes.signUp()}
        />
      }
    />
  );
}
