import { User } from '../../../generated/prisma/client';

export type ApplicationWithUser = {
  id: number;
  userId: number;
  type: string;
  status: string;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  user: Omit<User, 'passwordHash' | 'salt'>;
};

export type GetApplicationsResponse = {
  applications: ApplicationWithUser[];
};
