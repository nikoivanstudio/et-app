import { FormDialogDomain } from '@/entities/form-dialog';
import { Role } from '@/entities/user/domain';

export const editUserFormModel: FormDialogDomain.FormDataModelItem[] = [
  {
    type: 'string',
    label: 'Логин',
    name: 'login',
    required: true
  },
  {
    type: 'string',
    label: 'Телефон',
    name: 'phone',
    required: true
  },
  {
    type: 'string',
    label: 'Имя',
    name: 'firstName'
  },
  {
    type: 'string',
    label: 'Фамилия',
    name: 'lastName'
  },
  {
    type: 'string',
    label: 'Email',
    name: 'email'
  },
  {
    type: 'number',
    label: 'Рейтинг',
    name: 'rating'
  },
  {
    type: 'select',
    label: 'Роль',
    name: 'role',
    required: true,
    options: Object.values(Role)
  }
];
