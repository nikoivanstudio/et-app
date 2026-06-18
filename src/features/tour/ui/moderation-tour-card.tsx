'use client';

import { CalendarDays, Check, Eye, Mail, Phone, User, X } from 'lucide-react';
import { FC, useState } from 'react';

import { TourFeature } from '@/features/tour/containers/tour-feature';
import { ModerationTour } from '@/features/tour/domain';
import { TourPreview } from '@/features/tour/ui/tour-preview';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';
import { Separator } from '@/shared/ui/separator';

type Props = {
  tour: ModerationTour;
  isPending: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number, comment?: string) => void;
};

const formatDate = (value: Date | string): string | null => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
};

export const ModerationTourCard: FC<Props> = ({
  tour,
  isPending,
  onApprove,
  onReject
}) => {
  const [isRejecting, setRejecting] = useState(false);
  const [comment, setComment] = useState('');

  const { author } = tour;
  const fullName = [author.firstName, author.lastName].filter(Boolean).join(' ');

  return (
    <Card className='w-full shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between gap-4 pb-2'>
        <CardTitle className='text-xl'>{tour.title}</CardTitle>
        <Badge variant='secondary'>На модерации</Badge>
      </CardHeader>
      <Separator className='my-2' />
      <CardContent className='mt-2 grid gap-3 text-sm'>
        <div className='flex items-center gap-3'>
          <User className='h-4 w-4 shrink-0 text-muted-foreground' />
          <span className='text-muted-foreground'>Автор (гид):</span>
          <span className='font-medium'>{fullName || author.login}</span>
        </div>
        {!!author.email && (
          <div className='flex items-center gap-3'>
            <Mail className='h-4 w-4 shrink-0 text-muted-foreground' />
            <span className='font-medium'>{author.email}</span>
          </div>
        )}
        {!!author.phone && (
          <div className='flex items-center gap-3'>
            <Phone className='h-4 w-4 shrink-0 text-muted-foreground' />
            <span className='font-medium'>{author.phone}</span>
          </div>
        )}
        <div className='flex items-center gap-3'>
          <CalendarDays className='h-4 w-4 shrink-0 text-muted-foreground' />
          <span className='text-muted-foreground'>Отправлен:</span>
          <span className='font-medium'>{formatDate(tour.createdAt)}</span>
        </div>

        <div className='flex flex-wrap gap-2 pt-1'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' size='sm' type='button'>
                <Eye className='mr-2 h-4 w-4' />
                Предпросмотр
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Предпросмотр страницы тура</DialogTitle>
              </DialogHeader>
              <TourPreview
                title={tour.title}
                mainPhoto={tour.mainPhoto?.source}
                price={tour.price}
                duration={tour.duration}
                rating={tour.rating}
                content={tour.content}
                photos={tour.photos?.map(photo => photo.source) ?? []}
              />
            </DialogContent>
          </Dialog>

          {/* Редактирование любого поля + назначение тегов (только админ).
              triggerBtn — строка: FormDialog сам обернёт её в одну кнопку
              (иначе получился бы <button> внутри <button>). */}
          <TourFeature
            type='edit'
            data={tour}
            id={tour.id}
            authorId={tour.authorId}
            withTags
            title='Редактировать тур'
            triggerBtn='Редактировать'
          />
        </div>
      </CardContent>

      <CardFooter className='flex flex-col gap-2 pt-2'>
        {isRejecting ? (
          <div className='w-full space-y-2'>
            <textarea
              className='min-h-20 w-full rounded-md border bg-transparent p-2 text-sm'
              placeholder='Причина отклонения (увидит гид)'
              value={comment}
              onChange={event => setComment(event.target.value)}
            />
            <div className='flex gap-2'>
              <Button
                variant='destructive'
                className='flex-1'
                disabled={isPending}
                onClick={() => onReject(tour.id, comment.trim() || undefined)}
              >
                Подтвердить отклонение
              </Button>
              <Button
                variant='outline'
                className='flex-1'
                disabled={isPending}
                onClick={() => setRejecting(false)}
              >
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex w-full gap-2'>
            <Button
              className='flex-1'
              disabled={isPending}
              onClick={() => onApprove(tour.id)}
            >
              <Check className='mr-2 h-4 w-4' />
              Одобрить
            </Button>
            <Button
              variant='destructive'
              className='flex-1'
              disabled={isPending}
              onClick={() => setRejecting(true)}
            >
              <X className='mr-2 h-4 w-4' />
              Отклонить
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
