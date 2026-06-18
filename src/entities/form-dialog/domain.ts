import { ReactNode } from 'react';
import { z } from 'zod';

import { TourContent } from '@/entities/tour/model/content';

enum DialogTypes {
  CREATE = 'create',
  EDIT = 'edit',
  READ = 'read'
}

type DialogType<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
}[keyof T];

export type Settings = {
  dialogType: DialogType<DialogTypes>;
};

export type ZErrors =
  | {
      _errors: string[];
    }
  | undefined;

export type FormCheckTypes<
  T extends Record<string, unknown> = Record<string, string>
> = {
  string: string;
  number: number;
  date: string;
  select: string;
  boolean: boolean;
  stringArray: string[];
  files: File[];
  blocks: TourContent;
  custom: T;
};

export type Value<T extends Record<string, unknown> = Record<string, string>> =
  | undefined
  | boolean
  | number
  | string
  | string[]
  | File[]
  | TourContent
  | T;

export type FormRowProps<
  T extends Record<string, unknown> = Record<string, string>
> = {
  [K in keyof FormCheckTypes<T>]: {
    type: K;
    label: ReactNode;
    name: string;
    onChange: (value: Record<string, Value<T>>) => void;
    options?: string[];
    required?: boolean;
    multiple?: boolean;
    hidden?: boolean;
    value?: FormCheckTypes<T>[K];
    error?: string;
  };
}[keyof FormCheckTypes<T>];

export type FormData<
  T extends Record<string, unknown> = Record<string, unknown>
> = Record<string, Value<FormCheckTypes<T>>>;

export type FormDataModelItem<
  T extends Record<string, unknown> = Record<string, unknown>
> = Omit<FormRowProps<FormCheckTypes<T>>, 'onChange' | 'value'>;

export type FormProps<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  initialData: FormData<T>;
  formDataModel: FormDataModelItem<T>[];
  onSubmit: (data: FormData<T>) => void;
  schema: z.Schema;
  type: 'put' | 'patch';
  onCancel?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  // Необязательный живой предпросмотр: получает текущее состояние формы.
  preview?: (data: FormData<T>) => ReactNode;
};

export type InputProps<
  T extends Record<string, unknown> = Record<string, string>,
  K extends Value<T> = string
> = {
  type: string;
  name: string;
  onChange: (value: Record<string, Value<T>>) => void;
  value?: K extends Value<T> ? K : never;
  multiple?: boolean;
  hidden?: boolean;
};
