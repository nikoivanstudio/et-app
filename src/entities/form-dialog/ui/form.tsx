'use client';

import { cn } from '@bem-react/classname';
import { FormEvent, useState } from 'react';

import {
  FormCheckTypes,
  FormData,
  FormProps,
  FormRowProps,
  Value,
  ZErrors
} from '@/entities/form-dialog/domain';
import { FormRow } from '@/entities/form-dialog/ui/form-row';

import { Button } from '@/shared/ui/button';

const cnForm = cn('Form');

export const Form = <
  T extends Record<string, unknown> = Record<string, string>
>({
  initialData,
  formDataModel,
  onSubmit,
  onCancel,
  type,
  schema,
  title,
  description,
  preview
}: FormProps<T>) => {
  const [userFormData, setUserFormData] = useState<Partial<FormData<T>>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const formData: FormData<T> = {
    ...(initialData as FormData<T>),
    ...(userFormData as Partial<FormData<T>>)
  };

  const isChanged = Object.entries(userFormData).some(
    ([key, value]) => initialData[key as never] !== value
  );

  const handleReset = () => {
    setUserFormData({});

    if (onCancel) onCancel();
  };

  const validate = () => {
    const result = schema.safeParse(formData);

    if (result.success) {
      return undefined;
    }

    return result.error.format();
  };

  const onChange = (value: Record<string, Value<FormCheckTypes<T>>>) => {
    setUserFormData(prev => ({ ...prev, ...value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validate();

    if (errors) {
      setShowErrors(true);

      return;
    }

    onSubmit(type === 'patch' ? userFormData : formData);
  };

  const errors = showErrors ? validate() : undefined;

  return (
    <form className={cnForm(null)} onSubmit={handleSubmit}>
      {!!title && (
        <div className={cnForm('Title', ['text-center text-xl my-4'])}>
          {title}
        </div>
      )}
      {!!description && (
        <div className={cnForm('Description')}>{description}</div>
      )}
      {formDataModel.map((row, idx) => {
        const props = {
          ...row,
          onChange,
          value: formData[row.name],
          error: (errors?.[row.name as never] as ZErrors)?._errors.join(', ')
        } as FormRowProps<FormCheckTypes<T>>;

        return <FormRow {...props} key={idx} />;
      })}
      {!!preview && showPreview && (
        <div className={cnForm('Preview', ['my-4'])}>{preview(formData)}</div>
      )}
      <div className={cnForm('Actions', ['flex', 'justify-end', 'gap-5'])}>
        {!!preview && (
          <Button
            type='button'
            variant='outline'
            className='mr-auto'
            onClick={() => setShowPreview(prev => !prev)}
          >
            {showPreview ? 'Скрыть предпросмотр' : 'Предпросмотр'}
          </Button>
        )}
        <Button
          variant='outline'
          onClick={handleReset}
          disabled={!isChanged && !onCancel}
        >
          Отмена
        </Button>
        <Button
          type='submit'
          variant='outline'
          disabled={!isChanged || !!errors}
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
};
