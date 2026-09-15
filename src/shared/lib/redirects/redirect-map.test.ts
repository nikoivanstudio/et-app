/**
 * @jest-environment node
 */
import { findRedirect, resetRedirectCache } from './redirect-map';

const ORIGIN = 'https://energy-tur.ru';

const RULES = [
  { source: '/tury', destination: '/tours', statusCode: 301 },
  { source: '/chufut-kale-2', destination: '/chufut-kale', statusCode: 301 }
];

const mockFetch = (
  response: unknown,
  init: { ok?: boolean } = {}
): jest.Mock => {
  const fn = jest.fn().mockResolvedValue({
    ok: init.ok ?? true,
    json: async () => response
  });

  global.fetch = fn as unknown as typeof fetch;

  return fn;
};

beforeEach(() => {
  resetRedirectCache();
  jest.useRealTimers();
});

describe('findRedirect', () => {
  test('находит правило после первой загрузки', async () => {
    mockFetch(RULES);

    expect(await findRedirect(ORIGIN, '/tury')).toEqual({
      destination: '/tours',
      statusCode: 301
    });
  });

  test('на неизвестный адрес правила нет', async () => {
    mockFetch(RULES);

    expect(await findRedirect(ORIGIN, '/kontakty')).toBeUndefined();
  });

  test('карта грузится один раз, а не на каждый запрос', async () => {
    // Прокси выполняется перед КАЖДЫМ запросом, включая обход робота:
    // запрос к базе на каждый адрес превратил бы скан несуществующих
    // страниц в нагрузку на БД.
    const fetchMock = mockFetch(RULES);

    await findRedirect(ORIGIN, '/tury');
    await findRedirect(ORIGIN, '/chufut-kale-2');
    await findRedirect(ORIGIN, '/kontakty');

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('одновременные запросы на холодном кеше дают одну загрузку', async () => {
    // Ровно то, что происходит сразу после деплоя.
    const fetchMock = mockFetch(RULES);

    await Promise.all([
      findRedirect(ORIGIN, '/tury'),
      findRedirect(ORIGIN, '/tury'),
      findRedirect(ORIGIN, '/tury')
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('недоступная база не роняет прокси', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('no database')) as unknown as typeof fetch;

    await expect(findRedirect(ORIGIN, '/tury')).resolves.toBeUndefined();
  });

  test('ошибка ответа не приводит к попытке на каждый запрос', async () => {
    // После неудачи попытки повторяются не чаще раза в RETRY_MS: лежащая
    // база иначе означала бы запрос к ней на каждый просмотр страницы.
    // Две попытки на один заход — это два адреса, внутренний и запасной.
    const fetchMock = mockFetch(null, { ok: false });

    await findRedirect(ORIGIN, '/tury');
    await findRedirect(ORIGIN, '/tury');

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('карта грузится с внутреннего адреса, а не с адреса запроса', async () => {
    // Публичный origin изнутри контейнера может быть недостижим — петля
    // наружу через DNS и обратный прокси заворачивается не везде.
    const fetchMock = mockFetch(RULES);

    await findRedirect(ORIGIN, '/tury');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/redirects',
      expect.anything()
    );
  });

  test('недоступный внутренний адрес — карта грузится с адреса запроса', async () => {
    const fetchMock = jest.fn(async (url: string) =>
      url.startsWith(ORIGIN)
        ? { ok: true, json: async () => RULES }
        : Promise.reject(new Error('connection refused'))
    );

    global.fetch = fetchMock as unknown as typeof fetch;

    expect(await findRedirect(ORIGIN, '/tury')).toEqual({
      destination: '/tours',
      statusCode: 301
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('мусор вместо списка правил игнорируется', async () => {
    mockFetch({ error: 'oops' });

    await expect(findRedirect(ORIGIN, '/tury')).resolves.toBeUndefined();
  });
});
