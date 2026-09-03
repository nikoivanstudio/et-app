import Link from 'next/link';
import React from 'react';

export function BottomLink({
  linkText,
  text,
  url
}: {
  text: string;
  linkText: string;
  url: string;
}) {
  return (
    <p className='text-sm text-ink-muted'>
      {text}{' '}
      <Link href={url} className='font-semibold text-gold-ink hover:underline'>
        {linkText}
      </Link>
    </p>
  );
}
