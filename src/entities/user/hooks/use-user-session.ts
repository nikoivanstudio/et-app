'use client';

import { useEffect, useState } from 'react';

import { getSessionRequest } from '@/entities/user/api/session-requests';
import { SessionEntity } from '@/entities/user/domain';

export function useUserSession() {
  const [session, setSession] = useState<SessionEntity | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { session: newSession } = await getSessionRequest();

      if (session !== newSession) {
        setSession(newSession);
      }

      setLoading(false);
    })();
  }, []);

  return { session, isLoading };
}
