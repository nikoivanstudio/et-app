'use client';

import { BadgeRussianRuble, HeartIcon, UserPen, XCircle } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';
import { toast } from 'sonner';

import TourFeature from '@/features/tour';
import { useDeleteTour } from '@/features/tour/hooks/use-delete-tour';

import { ConfirmDialog } from '@/entities/confirm-dialog';
import { TourDomain } from '@/entities/tour/server';

import { cn } from '@/shared/lib/css';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

export const TourCard: FC<TourDomain.TourEntity> = props => {
  const { id, title, mainPhoto, content, rating, price } = props;
  const onDelete = useDeleteTour({
    id,
    onSuccess: () => toast.success('Тур успешно удален'),
    onError: () => toast.error('Ошибка. Не удалось удалить тур')
  });

  return (
    <Card className='max-w-md'>
      <CardHeader className='flex items-center justify-between gap-3'>
        <div className='flex flex-col gap-0.5'>
          <CardTitle className='flex items-center gap-1 text-sm'>
            Название тура
          </CardTitle>
          <CardDescription>{title}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className='space-y-6 text-sm'>
        <Image
          src={mainPhoto.source}
          alt={mainPhoto.title}
          width={400}
          height={400}
        />
        <p>{content.lead.slice(0, 250)} ...</p>
      </CardContent>
      <CardFooter className='flex justify-end items-center gap-1'>
        <Button variant='ghost' size='sm'>
          <HeartIcon className={cn('size-4')} />
          {rating}
        </Button>
        <Button variant='ghost' size='sm'>
          <BadgeRussianRuble className='size-4' />
          {price}
        </Button>
        <TourFeature
          triggerBtn={<UserPen className='size-4' />}
          type='edit'
          data={props}
          id={props.id}
          authorId={props.authorId}
        />

        <ConfirmDialog
          title='Удаление тура'
          description='Вы уверенны, что хотите удалить этот тур?'
          triggger={
            <Button variant='ghost' size='sm'>
              <XCircle className='size-4' />
            </Button>
          }
          onSubmit={onDelete}
        />
      </CardFooter>
    </Card>
  );
};
