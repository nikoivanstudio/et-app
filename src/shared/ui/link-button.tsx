import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';

const cnLinkButton = cn('LinkButton');

type LinkButtonProps = PropsWithChildren<{
  href: string;
  className?: string;
}>;

/**
 * Главная кнопка продукта. Тёмная тушь на золоте бренда — 5.96:1.
 * До v2 здесь был bg-green-500 с белым текстом: 2.28:1, ниже порога даже
 * для крупного текста, и зелёный не входил в палитру.
 */
export const LinkButton: FC<LinkButtonProps> = ({
  children,
  href,
  className = ''
}) => (
  <Link
    className={cnLinkButton(null, [
      'inline-flex items-center justify-center min-h-12 px-10',
      'bg-cta hover:bg-cta-press text-on-cta',
      'text-base font-semibold tracking-wide rounded-pill',
      'transition-colors',
      className
    ])}
    href={href}
  >
    {children}
  </Link>
);
