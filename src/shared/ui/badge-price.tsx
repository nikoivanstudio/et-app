import { cn } from '@bem-react/classname';
import { FC } from 'react';

import styles from '@/shared/assets/styles.module.scss';
import { sanitizeInlineHtml } from '@/shared/lib/sanitize-inline';

type Variants = 'clear-blur' | 'black-white' | 'fact';

type CardPriceProps = {
  price: number | string;
  className?: string;
  variant?: Variants;
};

const cnBadgePrice = cn('BadgePrice', 'text-white');

const VARIANT_STYLES: Record<Variants, string> = {
  'clear-blur': styles.BadgePrice_type_clearBlur,
  'black-white': styles.BadgePrice_type_blackWhite,
  fact: styles.BadgePrice_type_fact
};

export const BadgePrice: FC<CardPriceProps> = ({
  price,
  className,
  variant = 'clear-blur'
}) => (
  <div
    className={cnBadgePrice(null, [
      // В строке факта цена — не плашка, а текст на скриме.
      variant === 'fact'
        ? ''
        : 'backdrop-blur-xs px-6 py-1 text-lg rounded-pill',
      className,
      styles.BadgePrice,
      VARIANT_STYLES[variant]
    ])}
  >
    {typeof price === 'number' ? (
      `от ${price} ₽`
    ) : (
      <span
        className='whitespace-nowrap text-xs'
        dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(price) }}
      ></span>
    )}
  </div>
);
