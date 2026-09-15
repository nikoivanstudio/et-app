import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

/**
 * Статусная плашка кабинета.
 *
 * Цвет здесь — роль, а не украшение: золото значит «требует действия»,
 * зелёный — «всё хорошо», серый — «закрыто», красный — «сорвалось».
 * Тот же набор тонов используется и для заявок, и для туров, поэтому
 * гид читает статус одинаково на всех экранах.
 */
export type ChipTone = 'new' | 'work' | 'ok' | 'done' | 'bad' | 'wait';

const tones: Record<ChipTone, string> = {
  new: 'border-cab-gold/35 bg-cab-gold/15 text-cab-gold',
  work: 'border-cab-info/30 bg-cab-info/12 text-cab-info',
  ok: 'border-cab-ok/30 bg-cab-ok/12 text-cab-ok',
  done: 'border-cab-line bg-cab-line/60 text-cab-dim',
  bad: 'border-cab-bad/30 bg-cab-bad/12 text-cab-bad',
  wait: 'border-cab-wait/30 bg-cab-wait/12 text-cab-wait'
};

export const Chip: FC<{
  tone?: ChipTone;
  children: ReactNode;
  className?: string;
}> = ({ tone = 'done', children, className }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap',
      tones[tone],
      className
    )}
  >
    {children}
  </span>
);

/** Счётчик непрочитанного: золотая пилюля с тёмной тушью. */
export const CountPill: FC<{ count: number; className?: string }> = ({
  count,
  className
}) =>
  count > 0 ? (
    <span
      className={cn(
        'bg-cab-gold text-cab-on-gold rounded-full px-1.5 text-[11px] leading-[18px] font-semibold',
        className
      )}
    >
      {count}
    </span>
  ) : null;
