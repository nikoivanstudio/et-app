import { CalendarClock, CheckCircle2, CircleDollarSign, Filter, Search } from 'lucide-react';

import { cn } from '@/shared/lib/css';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

import { orders,orderTabs } from './data';
import { GuideDashboardShellTemplate } from './guide-dashboard-shell';

const statusTone = {
  confirmed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  pending: 'bg-[var(--gold-photo)]/15 text-[var(--gold-photo)] border-[var(--gold-photo)]/30',
  paid: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
} as const;

const statusLabel = {
  confirmed: 'Подтверждён',
  pending: 'Ожидает',
  paid: 'Новый'
} as const;

export function GuideOrdersPageTemplate() {
  return (
    <GuideDashboardShellTemplate
      activeItem='orders'
      title='Заказы'
      subtitle='Текущие туры. Шесть колонок вместо одиннадцати — таблица влезает в экран без горизонтальной прокрутки.'
      actions={
        <div className='flex items-center gap-3'>
          <Card className='gap-0 rounded-block border-border/60 bg-card/70 px-4 py-3'>
            <p className='text-[11px] uppercase tracking-[0.2em] text-muted-foreground'>
              Общая выручка
            </p>
            <p className='mt-1 text-xl font-semibold'>1 094 087 ₽</p>
          </Card>
        </div>
      }
    >
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-3'>
          <Card className='rounded-block border-border/60 bg-card/70'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <CalendarClock className='size-4 text-primary' />
                Активные заезды
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-semibold'>204</p>
            </CardContent>
          </Card>
          <Card className='rounded-block border-border/60 bg-card/70'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <CheckCircle2 className='size-4 text-emerald-400' />
                Подтверждено
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-semibold'>173</p>
            </CardContent>
          </Card>
          <Card className='rounded-block border-border/60 bg-card/70'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <CircleDollarSign className='size-4 text-[var(--gold-photo)]' />
                На месте к оплате
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-semibold'>86 425 ₽</p>
            </CardContent>
          </Card>
        </div>

        <Card className='rounded-card border-border/60 bg-card/70 py-0'>
          <CardHeader className='gap-4 border-b border-border/60 py-5'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex flex-wrap gap-2'>
                {orderTabs.map((tab, index) => (
                  <Button
                    key={tab}
                    variant={index === 0 ? 'default' : 'ghost'}
                    className={cn('rounded-control', index !== 0 && 'text-muted-foreground')}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <div className='relative min-w-64'>
                  <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
                  <Input className='pl-9' placeholder='Поиск по заказам' />
                </div>
                <Button variant='outline' className='rounded-control'>
                  <Filter className='size-4' />
                  Фильтры
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className='overflow-x-auto px-0'>
            <table className='w-full text-sm'>
              <thead className='border-b border-border/60 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground'>
                <tr>
                  <th className='px-6 py-4'>Тур и статус</th>
                  <th className='px-4 py-4'>Выезд</th>
                  <th className='px-4 py-4 text-center'>Чел.</th>
                  <th className='px-4 py-4'>Клиент</th>
                  <th className='px-4 py-4 text-right'>Наш доход</th>
                  <th className='px-6 py-4' />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className='border-b border-border/50 last:border-b-0'>
                    <td className='px-6 py-4'>
                      <div className='space-y-1.5'>
                        <span
                          className={cn(
                            'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium',
                            statusTone[order.status]
                          )}
                        >
                          {statusLabel[order.status]}
                        </span>
                        <p className='font-medium'>{order.tour}</p>
                        <p className='text-xs text-muted-foreground'>
                          Заказ № {order.id}
                        </p>
                      </div>
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap'>
                      <p>
                        {order.date} · {order.time}
                      </p>
                      <p className='mt-0.5 text-xs text-muted-foreground'>
                        {order.duration}
                      </p>
                    </td>
                    <td className='px-4 py-4 text-center'>{order.guests}</td>
                    <td className='px-4 py-4 whitespace-nowrap'>
                      <p>{order.client}</p>
                      <p className='mt-0.5 text-xs text-muted-foreground'>
                        {order.phone}
                      </p>
                    </td>
                    <td className='px-4 py-4 text-right font-medium whitespace-nowrap'>
                      {order.income}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <Button
                        size='sm'
                        variant='outline'
                        className='rounded-control whitespace-nowrap'
                      >
                        Детали →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
          <Badge variant='outline'>Текущие туры</Badge>
          <span>
            Статус, тур и номер собраны в одну ячейку, дата со временем и
            длительностью — в другую, ФИО с телефоном — в третью. «На месте к
            оплате» вынесено в сводную карточку сверху.
          </span>
        </div>
      </div>
    </GuideDashboardShellTemplate>
  );
}

