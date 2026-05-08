'use server';

import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';

const cnPostStats = cnBem('PostStats');

const STAT_CARD_CLASSES = cn(
  'flex',
  'flex-col',
  'items-center',
  'justify-center',
  'gap-2',
  'rounded-2xl',
  'border',
  'border-[#E2D5B7]',
  'bg-[#FBF7EE]',
  'px-2',
  'py-4',
  'text-center'
);

const STAT_VALUE_CLASSES = cn(
  'text-base',
  'font-semibold',
  'leading-tight',
  'text-[#1F1A12]'
);

const STAT_LABEL_CLASSES = cn(
  'text-[11px]',
  'leading-tight',
  'text-[#6B5F47]',
  'tracking-wide'
);

const ICON_STROKE = '#8B6F3D';

const WalletIcon: FC = () => (
  <svg
    width='26'
    height='26'
    viewBox='0 0 24 24'
    fill='none'
    stroke={ICON_STROKE}
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <rect x='2' y='6' width='20' height='14' rx='2' />
    <path d='M2 10h20' />
    <circle cx='17' cy='15' r='1.5' fill={ICON_STROKE} />
  </svg>
);

const ClockGoldIcon: FC = () => (
  <svg
    width='26'
    height='26'
    viewBox='0 0 24 24'
    fill='none'
    stroke={ICON_STROKE}
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <circle cx='12' cy='12' r='9' />
    <path d='M12 7v5l3 2' />
  </svg>
);

const PeopleIcon: FC = () => (
  <svg
    width='26'
    height='26'
    viewBox='0 0 24 24'
    fill='none'
    stroke={ICON_STROKE}
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <circle cx='9' cy='8' r='3' />
    <circle cx='17' cy='9' r='2.2' />
    <path d='M3 19c0-3 3-5 6-5s6 2 6 5' />
    <path d='M15 19c0-2 2-4 4-4s2 1 2 3' />
  </svg>
);

type Props = {
  priceValue?: number | null;
  price?: string | null;
  durationValue?: number | null;
  duration?: string | null;
  className?: string;
};

const stripTagsAndPrefix = (
  value: string | null | undefined,
  prefixRegex: RegExp
): string | null => {
  if (!value) return null;

  const text = value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(prefixRegex, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text || null;
};

const PRICE_PREFIX = /^\s*стоимость\s*[:\-—–]?\s*/i;
const DURATION_PREFIX = /^\s*продолжительность\s*[:\-—–]?\s*/i;
const PRICE_VEHICLE_SUFFIX = /\s*\/\s*машин(?:а|у|ы|е)?\s*$/i;

const formatPrice = (priceValue?: number | null, price?: string | null) => {
  if (typeof priceValue === 'number' && Number.isFinite(priceValue)) {
    return `от ${new Intl.NumberFormat('ru-RU').format(priceValue)} ₽`;
  }

  const fallbackPrice = stripTagsAndPrefix(price, PRICE_PREFIX);

  return fallbackPrice?.replace(PRICE_VEHICLE_SUFFIX, '').trim() ?? null;
};

export const PostStats: FC<Props> = async ({
  priceValue,
  price,
  durationValue,
  duration,
  className
}) => {
  const priceText = formatPrice(priceValue, price);
  const durationText = stripTagsAndPrefix(duration, DURATION_PREFIX);
  const durationValueText =
    typeof durationValue === 'number' && Number.isFinite(durationValue)
      ? `${(durationValue / 3600).toFixed(0)} часа`
      : null;

  return (
    <div
      className={cnPostStats(null, [
        cn('grid', 'grid-cols-3', 'gap-2'),
        className
      ])}
    >
      <div className={cnPostStats('Card', [STAT_CARD_CLASSES])}>
        <WalletIcon />
        <div className={STAT_VALUE_CLASSES}>{priceText ?? '—'}</div>
        <div className={STAT_LABEL_CLASSES}>за машину</div>
      </div>

      <div className={cnPostStats('Card', [STAT_CARD_CLASSES])}>
        <ClockGoldIcon />
        <div className={STAT_VALUE_CLASSES}>
          {durationValueText ?? durationText ?? '—'}
        </div>
        <div className={STAT_LABEL_CLASSES}>экскурсия</div>
      </div>

      <div className={cnPostStats('Card', [STAT_CARD_CLASSES])}>
        <PeopleIcon />
        <div className={STAT_VALUE_CLASSES}>до 6 чел.</div>
        <div className={STAT_LABEL_CLASSES}>в машине</div>
      </div>
    </div>
  );
};
