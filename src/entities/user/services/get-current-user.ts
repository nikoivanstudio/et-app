import { UserEntity } from '@/entities/user/domain';

import { userRepository } from '../repositories/user';

import { sessionService } from './session';

export const getCurrentUser = async (
  getCookies?: () => Promise<string | undefined>
): Promise<UserEntity | null> => {
  const { session } =
    await sessionService.verifySessionWithRedirect(getCookies);
  return userRepository.getUser({ id: session.id });
};
