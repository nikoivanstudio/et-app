'use client';

import { ChangeEvent, FC } from 'react';

import { Input } from '@/shared/ui/input';

type Props = {
  onChange(e: ChangeEvent<HTMLInputElement>): void;
};

export const UploadInput: FC<Props> = ({ onChange }) => (
  <Input
    multiple
    onChange={onChange}
    type='file'
    accept='image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf,.ppt,.pptx'
  />
);
