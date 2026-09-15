import { FC } from 'react';

import { CabinetShell } from '@/widgets/guide-cabinet/server';

import { GuideReviewsList } from '@/features/cabinet';
import {
  CabinetBadges,
  CabinetIdentity,
  CabinetReviewsSummary
} from '@/features/cabinet/server';

export const CabinetReviewsPage: FC<{
  identity: CabinetIdentity;
  badges: CabinetBadges;
  summary: CabinetReviewsSummary;
}> = ({ identity, badges, summary }) => (
  <CabinetShell
    identity={identity}
    badges={badges}
    section='reviews'
    title='Отзывы'
    subtitle='Отзыв оставляют после выполненной заявки, оценок три: работа гида, информация и маршрут. Ответить можно один раз — ответ виден всем на странице тура.'
  >
    <GuideReviewsList summary={summary} />
  </CabinetShell>
);
