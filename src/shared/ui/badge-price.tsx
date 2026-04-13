import { cn } from '@bem-react/classname';
import { FC } from 'react';

import styles from '@/shared/assets/styles.module.scss';

type Variants = 'clear-blur' | 'black-white';

type CardPriceProps = {
  price: number | string;
  className?: string;
  variant?: Variants;
};

const cnBadgePrice = cn('BadgePrice', 'text-white');

export const BadgePrice: FC<CardPriceProps> = ({
  price,
  className,
  variant
}) => (
  <div
    className={cnBadgePrice(null, [
      'backdrop-blur-xs px-6 py-1 text-lg rounded-full shadow-sm',
      className,
      styles.BadgePrice,
      variant === 'black-white'
        ? styles.BadgePrice_type_blackWhite
        : styles.BadgePrice_type_clearBlur
    ])}
  >
    {typeof price === 'number' ? (
      `От ${price} ₽`
    ) : (
      <span
        className={
          typeof price === 'number' ? undefined : 'whitespace-nowrap text-xs'
        }
        dangerouslySetInnerHTML={{ __html: price }}
      ></span>
    )}
  </div>
);
