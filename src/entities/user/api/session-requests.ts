import { SessionEntity } from '@/entities/user/domain';

import { urlUtils } from '@/shared/lib/url-utils';

export async function getSessionRequest(): Promise<{
  isAuth: boolean;
  session: SessionEntity | null;
}> {
  const baseResponse = { isAuth: false, session: null };
  const url = `${urlUtils.getOrigin()}/api/session`;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch {
    return baseResponse;
  }
}
