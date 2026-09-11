import { cn } from '@/shared/lib/css';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      /* Было bg-accent — серый из набора shadcn. Кремовая плашка из палитры
         v2: скелет и готовая страница на одном фоне. */
      className={cn('bg-cream-deep animate-pulse rounded-block', className)}
      {...props}
    />
  );
}

export { Skeleton };
