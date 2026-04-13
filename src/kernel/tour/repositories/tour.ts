import { dbClient } from '@/shared/lib/db';

import { Prisma } from '../../../../generated/prisma/client';

type Params = {
  where: Prisma.TourWhereInput;
  include?: Prisma.TourInclude;
  select?: Prisma.TourSelect;
  orderBy?: Prisma.TourOrderByWithRelationInput;
};

type TourConditionType =
  | {
      select?: Prisma.TourSelect;
    }
  | { include?: Prisma.TourInclude };

type TourUniqueArgs<T extends TourConditionType = TourConditionType> = {
  where: Prisma.TourWhereUniqueInput;
  omit?: Prisma.TourOmit;
} & T;

const getTour = <T extends TourConditionType = TourConditionType>(
  args: Prisma.TourFindUniqueArgs
): Promise<Prisma.TourGetPayload<TourUniqueArgs<T>> | null> =>
  dbClient.tour.findUnique(args) as Promise<Prisma.TourGetPayload<
    TourUniqueArgs<T>
  > | null>;

const getTours = <T extends Prisma.TourFindManyArgs = Prisma.TourFindManyArgs>(
  args: T
): Promise<Prisma.TourGetPayload<T>> => {
  return dbClient.tour.findMany(args) as Promise<Prisma.TourGetPayload<T>>;
};

export const tourRepository = { getTour, getTours };
