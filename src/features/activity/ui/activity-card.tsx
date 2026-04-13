'use client';

import { BadgeRussianRuble, HeartIcon, UserPen, XCircle } from 'lucide-react';
import { FC } from 'react';

import { deleteActivity } from '@/features/activity/api/activity-api';

import { ActivityDomain } from '@/entities/activity/server';
import { ConfirmDialog } from '@/entities/confirm-dialog';

import { cn } from '@/shared/lib/css';
import { dateUtils } from '@/shared/lib/date-utils';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

export const ActivityCard: FC<ActivityDomain.ActivityEntity> = props => {
  const {
    id,
    title,
    description,
    tour,
    startTime,
    finishTime,
    personPrice,
    groupPrice
  } = props;

  const onDelete = async () => await deleteActivity(id);

  return (
    <Card className='max-w-md'>
      <CardHeader className='flex items-center justify-between gap-3'>
        <div className='flex flex-col gap-0.5'>
          <CardTitle className='flex items-center gap-1 text-sm'>
            Название мероприятия
          </CardTitle>
          <CardDescription>{title}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className='space-y-6 text-sm'>
        <p>{description}</p>
        <p>
          <span>Начало тура: </span>
          {dateUtils.getFormattedDate(startTime)}
        </p>
        <p>
          <span>Начало тура: </span>
          {dateUtils.getFormattedDate(finishTime)}
        </p>
      </CardContent>
      <CardFooter className='flex justify-end items-center gap-1'>
        {!!tour?.rating && (
          <Button variant='ghost' size='sm'>
            <HeartIcon className={cn('size-4')} />
            {tour?.rating}
          </Button>
        )}
        <Button variant='ghost' size='sm'>
          <BadgeRussianRuble className='size-4' />
          {personPrice}/{groupPrice}
        </Button>
        <Button variant='ghost' size='sm'>
          <UserPen className='size-4' />
        </Button>
        <ConfirmDialog
          title='Удаление тура'
          description='Вы уверенны, что хотите удалить это мероприятие?'
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
