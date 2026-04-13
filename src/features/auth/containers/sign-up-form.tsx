'use client';

import React, { FC } from 'react';

import { useActionState } from '@/shared/lib/react';

import { routes } from '@/kernel/routes';

import { signUpAction } from '../actions/sign-up';
import { SignUpFormState } from '../domain';
import { AuthFormLayout } from '../ui/auth-form-layout';
import { AuthFields } from '../ui/fields';
import { BottomLink } from '../ui/ilnk';
import { SubmitButton } from '../ui/submit-button';
import { ErrorMessage } from '../ui/submit-button copy';

export const SignUpForm: FC = () => {
  const [formState, action, isPending] = useActionState(
    signUpAction,
    {} as SignUpFormState
  );

  return (
    <AuthFormLayout
      title='Регистрация'
      description='Создайте свой аккаунт для доступа ко всему приложению'
      action={action}
      fields={<AuthFields {...formState} type='signup' />}
      actions={
        <SubmitButton isPending={isPending}>Зарегистрироваться</SubmitButton>
      }
      error={<ErrorMessage error={formState.errors?._errors} />}
      link={
        <BottomLink
          text='Вы уже зарегистрированы?'
          linkText='Войти'
          url={routes.signIn()}
        />
      }
    />
  );
};
