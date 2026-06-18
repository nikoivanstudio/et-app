import { Role } from '@/entities/user/domain';

export enum PartnerApplicationType {
  GUIDE = 'GUIDE',
  SELLER = 'SELLER'
}

export enum PartnerApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type PartnerApplicationEntity = {
  id: number;
  userId: number;
  type: string;
  status: string;
  comment?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

export const PARTNER_APPLICATION_TYPE_LABELS: Record<string, string> = {
  [PartnerApplicationType.GUIDE]: 'Гид',
  [PartnerApplicationType.SELLER]: 'Реализатор'
};

export const PARTNER_APPLICATION_STATUS_LABELS: Record<string, string> = {
  [PartnerApplicationStatus.PENDING]: 'На рассмотрении',
  [PartnerApplicationStatus.APPROVED]: 'Одобрена',
  [PartnerApplicationStatus.REJECTED]: 'Отклонена'
};

// Какую роль получает пользователь при одобрении заявки соответствующего типа.
export const PARTNER_APPLICATION_TYPE_TO_ROLE: Record<string, Role> = {
  [PartnerApplicationType.GUIDE]: Role.GUIDE,
  [PartnerApplicationType.SELLER]: Role.SELLER
};
