import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { editUserApi } from '@/features/edit-user/api/edit-user-api';
import { EditableUser, UserEditPayload } from '@/features/edit-user/model/types';
import { editUserSchema } from '@/features/edit-user/model/user-schema';

import { FormDialogDomain } from '@/entities/form-dialog';

const errorMessage = 'Исходные данные пользователя не прошли проверку';

type HookProps = {
  id: number;
  onSuccess?: (user?: EditableUser) => void;
  onError?: (error: Error) => void;
};

export const useEditUser = ({ id, onSuccess, onError }: HookProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<EditableUser, Error, UserEditPayload>({
    mutationFn: editUserApi.editUser,
    onSuccess: user => {
      queryClient.invalidateQueries({ queryKey: [editUserApi.baseKey] });
      onSuccess?.(user);
    },
    onError: error => {
      toast.error(error.message);
      onError?.(error);
    }
  });

  return async (data: FormDialogDomain.FormData) => {
    const result = editUserSchema.partial().safeParse({
      ...data,
      id
    });

    if (!result.success) {
      throw new Error(errorMessage);
    }

    mutation.mutate(result.data as UserEditPayload);
  };
};
