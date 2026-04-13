'use client';

import Link from 'next/link';
import { FC } from 'react';

type BottomLinkProps = {
  linkText: string;
  text: string;
  url: string;
};

export const BottomLink: FC<BottomLinkProps> = ({ linkText, text, url }) => (
  <p className='text-sm text-primary/50'>
    {text}{' '}
    <Link className='font-medium text-primary hover:underline' href={url}>
      {linkText}
    </Link>
  </p>
);
