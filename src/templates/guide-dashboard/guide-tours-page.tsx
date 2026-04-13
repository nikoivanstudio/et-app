import { Eye, Pencil, Power, Trash2 } from 'lucide-react';

import { cn } from '@/shared/lib/css';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import { tours } from './data';
import { GuideDashboardShellTemplate } from './guide-dashboard-shell';

export function GuideToursPageTemplate() {
  return (
    <GuideDashboardShellTemplate
      activeItem='tours'
      title='Туры'
      subtitle='Список туров, стилизованный по аналогии со скриншотом списка туров.'
      actions={<Button className='rounded-xl'>Добавить тур</Button>}
    >
      <Card className='rounded-3xl border-border/60 bg-card/70 py-0'>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border/60 py-5'>
          <CardTitle className='text-lg'>Список туров</CardTitle>
          <p className='text-sm text-muted-foreground'>12 туров</p>
        </CardHeader>

        <CardContent className='space-y-3 px-4 py-4'>
          {tours.map((tour) => (
            <article
              key={tour.id}
              className={cn(
                'grid gap-4 rounded-2xl border p-4 lg:grid-cols-[160px_minmax(0,1fr)_210px]',
                tour.online
                  ? 'border-emerald-500/20 bg-emerald-500/6'
                  : 'border-slate-500/20 bg-slate-500/8'
              )}
            >
              <div className={cn('h-28 rounded-xl border border-white/10', tour.image)} />

              <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-3'>
                  <h3 className='text-base font-semibold'>{tour.title}</h3>
                  <Badge
                    className={cn(
                      tour.online
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-slate-500/20 text-slate-300'
                    )}
                  >
                    {tour.status}
                  </Badge>
                </div>
                <div className='mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground'>
                  <span>{tour.location}</span>
                  <span>•</span>
                  <span>{tour.duration}</span>
                  <span>•</span>
                  <span>{tour.price}</span>
                </div>
                <p className='mt-4 text-sm text-muted-foreground'>
                  Тур включен и доступен для заказа. В шаблоне оставлены зоны под картинку, статус и быстрые действия.
                </p>
              </div>

              <div className='flex flex-col gap-2 lg:items-end'>
                <Button variant='ghost' className='justify-start rounded-xl lg:w-36'>
                  <Pencil className='size-4' />
                  Редактировать
                </Button>
                <Button variant='ghost' className='justify-start rounded-xl lg:w-36'>
                  <Eye className='size-4' />
                  Посмотреть
                </Button>
                <Button variant='ghost' className='justify-start rounded-xl text-amber-300 hover:text-amber-200 lg:w-36'>
                  <Power className='size-4' />
                  {tour.online ? 'Выключить' : 'Включить'}
                </Button>
                <Button variant='ghost' className='justify-start rounded-xl text-destructive hover:text-destructive lg:w-36'>
                  <Trash2 className='size-4' />
                  Удалить
                </Button>
              </div>
            </article>
          ))}
        </CardContent>
      </Card>
    </GuideDashboardShellTemplate>
  );
}

