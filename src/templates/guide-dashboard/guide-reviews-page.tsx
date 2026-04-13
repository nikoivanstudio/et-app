import { Star } from 'lucide-react';

import { Card, CardContent } from '@/shared/ui/card';

import { reviews } from './data';
import { GuideDashboardShellTemplate } from './guide-dashboard-shell';

function RatingRow() {
  return (
    <div className='space-y-1 text-xs text-muted-foreground'>
      <div className='flex items-center justify-between gap-4'>
        <span>Рекомендуете попробовать</span>
        <div className='flex gap-1'>
          {[0, 1, 2, 3, 4].map((index) => (
            <Star key={index} className='size-3 fill-amber-400 text-amber-400' />
          ))}
        </div>
      </div>
      <div className='flex items-center justify-between gap-4'>
        <span>Тур соответствует описанию</span>
        <div className='flex gap-1'>
          {[0, 1, 2, 3, 4].map((index) => (
            <Star key={index} className='size-3 fill-amber-400 text-amber-400' />
          ))}
        </div>
      </div>
      <div className='flex items-center justify-between gap-4'>
        <span>Качество работы инструктора</span>
        <div className='flex gap-1'>
          {[0, 1, 2, 3, 4].map((index) => (
            <Star key={index} className='size-3 fill-amber-400 text-amber-400' />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GuideReviewsPageTemplate() {
  return (
    <GuideDashboardShellTemplate
      activeItem='reviews'
      title='Отзывы от ваших клиентов (26)'
      subtitle='Список отзывов по аналогии с CRM-экраном: дата, заказ, текст и блок оценок справа.'
    >
      <div className='space-y-3'>
        {reviews.map((review) => (
          <Card key={review.id} className='rounded-2xl border-border/60 bg-card/70 py-0'>
            <CardContent className='grid gap-6 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_240px]'>
              <div>
                <p className='text-xs text-muted-foreground'>
                  {review.date}, {review.author} ({review.city}) · Заказ {review.order}
                </p>
                <h3 className='mt-2 text-base font-semibold'>{review.tour}</h3>
                <p className='mt-3 max-w-4xl text-sm leading-6 text-muted-foreground'>{review.text}</p>
              </div>
              <div className='rounded-2xl border border-border/60 bg-background/40 p-4'>
                <RatingRow />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </GuideDashboardShellTemplate>
  );
}
