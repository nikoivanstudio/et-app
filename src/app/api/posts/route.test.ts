/**
 * Роуты используют Web-классы Request/Response, которых нет в jsdom.
 * Прогоняем в окружении node — там они доступны глобально (Node 20).
 * @jest-environment node
 */
import type { NextRequest } from 'next/server';

import { postUtils } from '@/features/post/lib/post-utils';
import { postServices } from '@/features/post/services/post-services';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { left, right } from '@/shared/lib/either';

// --- Моки зависимостей роутов (изолируем HTTP-слой от БД/сессий) ---
jest.mock('@/features/post/services/post-services', () => ({
  postServices: { getPosts: jest.fn(), createPosts: jest.fn() }
}));
jest.mock('@/entities/user/server', () => ({
  sessionService: { verifySession: jest.fn() }
}));
jest.mock('@/entities/user', () => ({
  roleUtils: { userHasPermissionOn: jest.fn() }
}));
jest.mock('@/features/post/lib/post-utils', () => ({
  postUtils: { getDataSourcePosts: jest.fn() }
}));

// Роут импортируем ПОСЛЕ объявления моков
import { GET, POST } from './route';

// Типизированные ссылки на замоканные функции
const mockGetPosts = postServices.getPosts as jest.Mock;
const mockCreatePosts = postServices.createPosts as jest.Mock;
const mockVerifySession = sessionService.verifySession as jest.Mock;
const mockUserHasPermissionOn = roleUtils.userHasPermissionOn as jest.Mock;
const mockGetDataSourcePosts = postUtils.getDataSourcePosts as jest.Mock;

type FakeRequestInit = {
  url?: string;
  session?: string;
  json?: unknown;
};

const makeRequest = (init: FakeRequestInit = {}): NextRequest => {
  const url = new URL(init.url ?? 'http://localhost/api/posts');

  return {
    nextUrl: { searchParams: url.searchParams },
    cookies: {
      get: (name: string) =>
        name === SESSION_COOKIE_NAME && init.session
          ? { value: init.session }
          : undefined
    },
    json: async () => init.json,
    formData: async () => new FormData()
  } as unknown as NextRequest;
};

const readBody = async (res: Response) => JSON.parse(await res.text());

describe('API /api/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('возвращает 200 и список постов при успехе сервиса', async () => {
      const payload = { pagesCount: 3, posts: [{ id: 1, title: 'Пост' }] };
      mockGetPosts.mockResolvedValue(right(payload));

      const res = await GET(
        makeRequest({ url: 'http://localhost/api/posts?page=2' })
      );

      expect(res.status).toBe(200);
      expect(await readBody(res)).toEqual(payload);
      expect(mockGetPosts).toHaveBeenCalledTimes(1);
    });

    it('возвращает 400, если сервис вернул ошибку (left)', async () => {
      mockGetPosts.mockResolvedValue(
        left('Ошибка получения постов из базы данных')
      );

      const res = await GET(makeRequest());

      expect(res.status).toBe(400);
      expect(await readBody(res)).toBe('Ошибка получения постов из базы данных');
    });
  });

  describe('POST', () => {
    it('возвращает 401, если нет cookie сессии', async () => {
      const res = await POST(makeRequest({ json: {} }));

      expect(res.status).toBe(401);
      expect(await readBody(res)).toBe('Ошибка верификации');
      expect(mockVerifySession).not.toHaveBeenCalled();
    });

    it('возвращает 403, если у роли нет права createPosts', async () => {
      mockVerifySession.mockResolvedValue({ session: { id: 1, role: 'GUIDE' } });
      mockUserHasPermissionOn.mockReturnValue(false);

      const res = await POST(makeRequest({ session: 'token', json: {} }));

      expect(res.status).toBe(403);
      expect(await readBody(res)).toBe('У вас нет полномочий на создание постов');
      expect(mockUserHasPermissionOn).toHaveBeenCalledWith('GUIDE', 'createPosts');
    });

    it('создаёт посты и возвращает 200 при наличии прав', async () => {
      mockVerifySession.mockResolvedValue({ session: { id: 1, role: 'ADMIN' } });
      mockUserHasPermissionOn.mockReturnValue(true);
      mockGetDataSourcePosts.mockResolvedValue([{ title: 'a' }, { title: 'b' }]);
      mockCreatePosts.mockResolvedValue(right({ count: 2 }));

      const res = await POST(makeRequest({ session: 'token', json: {} }));

      expect(res.status).toBe(200);
      expect(await readBody(res)).toBe('Успешно создано 2 постов.');
    });

    it('возвращает 400, если в источнике нет постов', async () => {
      mockVerifySession.mockResolvedValue({ session: { id: 1, role: 'ADMIN' } });
      mockUserHasPermissionOn.mockReturnValue(true);
      mockGetDataSourcePosts.mockResolvedValue([]);

      const res = await POST(makeRequest({ session: 'token', json: {} }));

      expect(res.status).toBe(400);
      expect(await readBody(res)).toBe('Посты отсутствуют');
      expect(mockCreatePosts).not.toHaveBeenCalled();
    });
  });
});
