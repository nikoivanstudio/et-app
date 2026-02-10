import cuid from 'cuid';

import { createId } from './id';

jest.mock('cuid', () => jest.fn());

describe('createId', () => {
  it('возвращает значение cuid', () => {
    (cuid as unknown as jest.Mock).mockReturnValue('cuid-id');
    expect(createId()).toBe('cuid-id');
  });
});
