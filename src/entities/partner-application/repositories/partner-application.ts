import { dbClient } from '@/shared/lib/db';

import { PartnerApplication,Prisma } from '../../../../generated/prisma/client';

const getApplicationsCount = (where?: Prisma.PartnerApplicationWhereInput) =>
  dbClient.partnerApplication.count({ where });

const getApplications = <T extends Prisma.PartnerApplicationFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.PartnerApplicationFindManyArgs>
): Promise<Prisma.PartnerApplicationGetPayload<T>[]> =>
  dbClient.partnerApplication.findMany(args) as Promise<
    Prisma.PartnerApplicationGetPayload<T>[]
  >;

const getApplication = (
  where: Prisma.PartnerApplicationWhereInput
): Promise<PartnerApplication | null> =>
  dbClient.partnerApplication.findFirst({
    where,
    orderBy: { createdAt: 'desc' }
  });

const createApplication = (data: {
  userId: number;
  type: string;
}): Promise<PartnerApplication> =>
  dbClient.partnerApplication.create({ data });

const updateApplication = (
  id: number,
  data: Prisma.PartnerApplicationUpdateInput
): Promise<PartnerApplication> =>
  dbClient.partnerApplication.update({ where: { id }, data });

// Одобрение в одной транзакции: меняем статус заявки и роль пользователя.
const approveApplication = (
  id: number,
  userId: number,
  role: string
): Promise<PartnerApplication> =>
  dbClient.$transaction(async prisma => {
    await prisma.user.update({ where: { id: userId }, data: { role } });

    return prisma.partnerApplication.update({
      where: { id },
      data: { status: 'APPROVED' }
    });
  });

export const partnerApplicationRepository = {
  getApplicationsCount,
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  approveApplication
};
