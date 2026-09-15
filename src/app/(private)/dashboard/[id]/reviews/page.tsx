import { FC } from 'react';

import { cabinetReviewsService, loadCabinetContext } from '@/features/cabinet/server';

import { CabinetReviewsPage } from '@/views/cabinet/server';

type Props = { params: Promise<{ id: string }> };

const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const { identity, badges, session } = await loadCabinetContext(id);
  const result = await cabinetReviewsService.getGuideReviews(session.id);

  return (
    <CabinetReviewsPage
      identity={identity}
      badges={badges}
      summary={
        result.type === 'right'
          ? result.value
          : {
              reviews: [],
              rating: 0,
              total: 0,
              unanswered: 0,
              distribution: [],
              criteria: {
                guideWork: 0,
                informationQuality: 0,
                trailQuality: 0
              }
            }
      }
    />
  );
};

export default Page;
