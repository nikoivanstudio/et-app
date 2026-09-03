import { CalendarDays, CirclePlus, Compass, MessageSquareQuote, Route, User2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/css';
import { Button } from '@/shared/ui/button';

import { dashboardNavItems } from './data';

type NavId = (typeof dashboardNavItems)[number]['id'];

const navIcons: Record<NavId, typeof Compass> = {
  orders: CalendarDays,
  crm: CirclePlus,
  tours: Route,
  reviews: MessageSquareQuote,
  profile: User2,
  'tour-editor': Compass
};

type GuideDashboardShellTemplateProps = {
  activeItem: NavId;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function GuideDashboardShellTemplate({
  activeItem,
  title,
  subtitle,
  actions,
  children
}: GuideDashboardShellTemplateProps) {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]'>
        <aside className='border-r border-border/60 bg-sidebar/30 px-4 py-6 lg:px-5'>
          <div className='rounded-block border border-border/60 bg-card/70 p-4 shadow-sm'>
            <p className='text-xs font-medium uppercase tracking-[0.24em] text-[var(--gold-photo)]/60'>
              Кабинет гида
            </p>
            <h2 className='mt-3 text-xl font-semibold'>Energy Tour</h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              Заявки, туры и отзывы.
            </p>
          </div>

          <nav className='mt-6 space-y-2'>
            {dashboardNavItems.map((item) => {
              const Icon = navIcons[item.id];

              return (
                <button
                  key={item.id}
                  type='button'
                  className={cn(
                    'flex min-h-11 w-full items-center gap-3 rounded-control border px-4 py-3 text-left text-sm transition-colors',
                    item.id === activeItem
                      ? 'border-[var(--gold-photo)]/35 bg-[var(--gold-photo)]/10 text-foreground'
                      : 'border-transparent bg-transparent text-muted-foreground hover:border-border/60 hover:bg-accent/40 hover:text-foreground'
                  )}
                >
                  <Icon className='size-4' />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className='mt-8 rounded-block border border-border/60 bg-card/50 p-4'>
            <p className='text-sm font-medium'>
              Спортивный клуб &quot;Экстрим-спорт&quot;
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>Иван Николаенко</p>
            <Button
              className='mt-4 h-auto min-h-11 w-full rounded-control py-2.5 text-center leading-snug whitespace-normal'
              variant='outline'
            >
              Посмотреть публичную страницу
            </Button>
          </div>
        </aside>

        <main className='flex min-w-0 flex-col'>
          <header className='border-b border-border/60 bg-background/80 px-5 py-5 backdrop-blur lg:px-8'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
              <div>
                <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
                {subtitle ? (
                  <p className='mt-2 max-w-3xl text-sm text-muted-foreground'>{subtitle}</p>
                ) : null}
              </div>
              {actions ? <div className='shrink-0'>{actions}</div> : null}
            </div>
          </header>

          <div className='flex-1 px-5 py-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </div>
  );
}
