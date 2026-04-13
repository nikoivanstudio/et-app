'use client';

import { cn } from '@bem-react/classname';
import { ReactNode } from 'react';

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal>
      <DialogTrigger asChild className={cnFormDialog('Trigger')}>
        <Button className={cnFormDialog('Trigger')} variant='ghost'>
          {triggerButton || 'Открыть диалог'}
        </Button>
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
