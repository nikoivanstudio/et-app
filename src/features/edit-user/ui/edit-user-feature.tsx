'use client';

import { cn } from '@bem-react/classname';
import { Pencil } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';

import { useEditUser } from '@/features/edit-user/hooks/use-edit-user';
import { editUserFormModel } from '@/features/edit-user/model/edit-user-form-model';
import { EditableUser } from '@/features/edit-user/model/types';
import { editUserSchema } from '@/features/edit-user/model/user-schema';

import { FormDialog, FormDialogDomain } from '@/entities/form-dialog';

const cnEditUserFeature = cn('EditUserFeature');

type Props = {
  user: EditableUser;
};

export const EditUserFeature: FC<Props> = ({ user }) => {
  const [isOpen, setOpen] = useState(false);
  const initialData: FormDialogDomain.FormData = {
    id: user.id,
    login: user.login,
    role: user.role,
    phone: user.phone ?? '',
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    rating: user.rating ?? undefined
  };

  const onOpenChange = (value: boolean) => setOpen(value);
  const onClose = () => setOpen(false);
  const successHandler = () => {
    setOpen(false);
    toast.success('Пользователь успешно обновлен');
  };

  const onSubmit = useEditUser({
    id: user.id,
    onSuccess: successHandler
  });

  return (
    <div className={cnEditUserFeature()}>
      <FormDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCancel={onClose}
        dialogTitle='Редактирование пользователя'
        dialogDescription='Супер-администратор может изменить данные пользователя, кроме пароля и соли.'
        triggerButton={<Pencil className='h-4 w-4' />}
        formDataModel={editUserFormModel}
        initialData={initialData}
        onSubmit={onSubmit}
        schema={editUserSchema}
        type='patch'
      />
    </div>
  );
};
