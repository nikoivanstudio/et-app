import { PartnerApplicationDomain } from '@/entities/partner-application';
import { partnerApplicationRepository } from '@/entities/partner-application/server';

import { Either, left, right } from '@/shared/lib/either';

import { PartnerApplication } from '../../../../generated/prisma/client';
import { ApplicationWithUser, GetApplicationsResponse } from '../domain';

const getApplications = async (): Promise<
  Either<string, GetApplicationsResponse>
> => {
  const applications = (await partnerApplicationRepository.getApplications({
    // Вся информация о пользователе, кроме пароля и соли.
    include: { user: { omit: { passwordHash: true, salt: true } } },
    // Сначала ожидающие рассмотрения, затем по дате создания.
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }]
  })) as unknown as ApplicationWithUser[];

  if (!applications) {
    return left('Ошибка получения заявок');
  }

  return right({ applications });
};

// Последняя заявка пользователя — для отображения статуса в профиле.
const getLatestApplicationByUser = (
  userId: number
): Promise<PartnerApplication | null> =>
  partnerApplicationRepository.getApplication({ userId });

const createApplication = async ({
  userId,
  type
}: {
  userId: number;
  type: string;
}): Promise<Either<string, PartnerApplication>> => {
  const existing = await partnerApplicationRepository.getApplication({
    userId,
    status: PartnerApplicationDomain.PartnerApplicationStatus.PENDING
  });

  if (existing) {
    return left('У вас уже есть заявка на рассмотрении');
  }

  const application = await partnerApplicationRepository.createApplication({
    userId,
    type
  });

  if (!application) {
    return left('Не удалось создать заявку');
  }

  return right(application);
};

const reviewApplication = async ({
  id,
  status,
  comment
}: {
  id: number;
  status: string;
  comment?: string;
}): Promise<Either<string, PartnerApplication>> => {
  const application = await partnerApplicationRepository.getApplication({ id });

  if (!application) {
    return left('Заявка не найдена');
  }

  if (
    application.status !== PartnerApplicationDomain.PartnerApplicationStatus.PENDING
  ) {
    return left('Заявка уже рассмотрена');
  }

  if (
    status === PartnerApplicationDomain.PartnerApplicationStatus.APPROVED
  ) {
    const role =
      PartnerApplicationDomain.PARTNER_APPLICATION_TYPE_TO_ROLE[
        application.type
      ];

    if (!role) {
      return left('Неизвестный тип заявки');
    }

    const approved = await partnerApplicationRepository.approveApplication(
      id,
      application.userId,
      role
    );

    return right(approved);
  }

  const rejected = await partnerApplicationRepository.updateApplication(id, {
    status: PartnerApplicationDomain.PartnerApplicationStatus.REJECTED,
    comment
  });

  return right(rejected);
};

export const partnerApplicationService = {
  getApplications,
  getLatestApplicationByUser,
  createApplication,
  reviewApplication
};
