import {
  Inbox,
  LayoutGrid,
  MessageSquare,
  Route,
  Star,
  User2
} from 'lucide-react';
import { FC } from 'react';

import { CabinetSection } from '@/widgets/guide-cabinet/model/nav';

const icons: Record<CabinetSection, FC<{ className?: string }>> = {
  overview: LayoutGrid,
  bookings: Inbox,
  messages: MessageSquare,
  tours: Route,
  reviews: Star,
  profile: User2
};

/** Иконка раздела. Один набор на боковое меню и на нижнюю панель телефона. */
export const CabinetIcon: FC<{
  section: CabinetSection;
  className?: string;
}> = ({ section, className }) => {
  const Icon = icons[section];

  return <Icon className={className} />;
};
