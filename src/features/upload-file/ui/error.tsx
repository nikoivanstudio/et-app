'use client';

import { FC } from 'react';

export const ErrorInfo: FC<{ errors?: string }> = ({ errors }) => (
  <>{errors ? <div>{errors}</div> : null}</>
);
