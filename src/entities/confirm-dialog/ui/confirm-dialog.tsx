'use client';

import { FC, ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui/alert-dialog';

type ConfirmDialogProps = {
  triggger: ReactNode;
  onSubmit(): void;
  title?: ReactNode;
  description?: ReactNode;
  cancelButton?: string;
  submitButton?: string;
};

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  triggger,
  onSubmit,
  title,
  description,
  cancelButton,
  submitButton
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{triggger}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{cancelButton || 'Отмена'}</AlertDialogCancel>
        <AlertDialogAction onClick={onSubmit}>
          {submitButton || 'Подтверждаю'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
