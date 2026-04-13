import { cn } from '@bem-react/classname';
import { FC, ReactNode } from 'react';

import { Title } from '@/shared/ui/title';

const cnActivities = cn('Activities');

type ActivitiesLayoutProps = {
  title: string;
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export const ActivitiesLayout: FC<ActivitiesLayoutProps> = ({
  title,
  content,
  footer,
  className
}) => (
  <section className={cnActivities(null, ['px-4', className])}>
    <div className={cnActivities('Header', ['pt-22'])}>
      <Title type='h2' className={cnActivities('Title')}>
        {title}
      </Title>
    </div>
    <div className={cnActivities('Main', ['mt-8'])}>{content}</div>
    <div className={cnActivities('Footer')}>{footer}</div>
  </section>
);
