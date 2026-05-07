'use client';

import { cn } from '@bem-react/classname';
import { isValidElement, ReactElement, ReactNode } from 'react';

import { FormProps } from '@/entities/form-dialog/domain';
import { Form } from '@/entities/form-dialog/ui/form';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';

type FormDialogProps = {
  isOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
  triggerButton?: ReactNode;
  dialogTitle?: ReactNode;
  dialogDescription?: ReactNode;
  className?: string;
} & Omit<FormProps, 'type'> & { type?: 'put' | 'patch' };

const cnFormDialog = cn('FormDialog');

const isNativeInteractiveElement = (element: ReactElement) =>
  typeof element.type === 'string' &&
  ['button', 'a'].includes(element.type);

export const FormDialog = (props: FormDialogProps) => {
  const {
    isOpen,
    onOpenChange,
    triggerButton,
    dialogTitle,
    dialogDescription,
    ...formProps
  } = props;

  const type = formProps.type ? formProps.type : 'put';
  const resolvedTrigger = isValidElement(triggerButton) ? (
    isNativeInteractiveElement(triggerButton) ? (
      triggerButton
    ) : (
      <Button
        className={cnFormDialog('Trigger')}
        variant='ghost'
        size='sm'
        type='button'
      >
        {triggerButton}
      </Button>
    )
  ) : (
    <Button
      className={cnFormDialog('Trigger')}
      variant='ghost'
      type='button'
    >
      {triggerButton || 'Открыть диалог'}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal>
      <DialogTrigger asChild className={cnFormDialog('Trigger')}>
        {resolvedTrigger}
      </DialogTrigger>
      <DialogContent className='h-full overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...{ ...formProps, type }} />
      </DialogContent>
    </Dialog>
  );
};
