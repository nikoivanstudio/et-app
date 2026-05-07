'use client';

import { cn } from '@bem-react/classname';
import { FC, useState } from 'react';

import { FeatureTypes } from '@/features/post/domain';
import { useCreatePost } from '@/features/post/hooks/use-create-post';
import { useEditPost } from '@/features/post/hooks/use-edit-post';
import { getTitleByType } from '@/features/post/lib/feature-utils';
import { postUtils } from '@/features/post/lib/post-utils';
import { createPostModel } from '@/features/post/model/create-posts-model';
import { FeatureTriggerIcon } from '@/features/post/ui/feature-trigger-icon';

import { FormDialog, FormDialogDomain } from '@/entities/form-dialog';
import { FormCheckTypes, Value } from '@/entities/form-dialog/domain';
import { postPatchSchema } from '@/entities/post';
import { postCreateSchema } from '@/entities/post/model/schemas';
import { SessionDomain } from '@/entities/user/server';

type Props = {
  session: SessionDomain.SessionEntity;
  type: FeatureTypes;
  initialData?: FormDialogDomain.FormData;
};

const cnFeaturePost = cn('FeaturePost');

export const FeaturePost: FC<Props> = ({ type, initialData, session }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { user: _user, session: _session, ...editInitialData } =
    (initialData ?? {}) as FormDialogDomain.FormData & {
      user?: Value<FormCheckTypes<Record<string, unknown>>>;
      session?: Value<FormCheckTypes<Record<string, unknown>>>;
    };
  const editPostId =
    type === 'edit' && typeof initialData?.id === 'number'
      ? initialData.id
      : undefined;
  const onEdit = useEditPost(editPostId);
  const onCreate = useCreatePost();
  const title = getTitleByType(type);
  const schema = type === 'edit' ? postPatchSchema : postCreateSchema;
  const startData = initialData || postUtils.getInitialPostData();

  const onOpenChange = (value: boolean) => setOpen(value);
  const onClose = () => setOpen(false);

  const onSubmit = async (data: FormDialogDomain.FormData) => {
    const fn = type === 'edit' ? onEdit : onCreate;

    await fn(data);

    setOpen(false);
  };

  return (
    <div className={cnFeaturePost(null, ['text-center'])}>
      <FormDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCancel={onClose}
        title={title}
        triggerButton={<FeatureTriggerIcon type={type} />}
        formDataModel={createPostModel}
        initialData={
          type === 'edit'
            ? editInitialData
            : {
                ...startData,
                postAuthorId: session.id,
                user: session as unknown as Value<
                  FormCheckTypes<Record<string, unknown>>
                >
              }
        }
        onSubmit={onSubmit}
        schema={schema}
        type={type === 'edit' ? 'patch' : 'put'}
      />
    </div>
  );
};
