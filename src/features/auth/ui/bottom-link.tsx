'use client';

import Link from 'next/link';
import { FC } from 'react';

type BottomLinkProps = {
  linkText: string;
  text: string;
  url: string;
};

export const BottomLink: FC<BottomLinkProps> = ({ linkText, text, url }) => (
  <p className='text-sm text-ink-muted'>
    {text}{' '}
    <Link className='font-semibold text-gold-ink hover:underline' href={url}>
      {linkText}
    </Link>
  </p>
);
