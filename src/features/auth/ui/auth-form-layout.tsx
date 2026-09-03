import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

export function AuthFormLayout({
  actions,
  description,
  fields,
  link,
  title,
  error,
  action
}: {
  title: string;
  description: string;
  fields: React.ReactNode;
  actions: React.ReactNode;
  link: React.ReactNode;
  error: React.ReactNode;
  action: (formData: FormData) => void;
}) {
  return (
    <Card className='w-full max-w-md gap-6 rounded-block border-rule bg-cream py-7'>
      <CardHeader>
        <CardTitle className='font-poiret text-center text-[32px] font-normal tracking-[2px] text-gold-head'>
          {title}
        </CardTitle>
        <CardDescription className='text-center text-ink-muted'>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className='space-y-4'>
          {fields}
          {error}
          {actions}
        </form>
      </CardContent>
      <CardFooter className='flex justify-center'>{link}</CardFooter>
    </Card>
  );
}
