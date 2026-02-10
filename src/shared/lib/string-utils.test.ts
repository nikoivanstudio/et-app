import { v4 } from 'uuid';

import { formatNumber, getUniqName, translit } from './string-utils';

jest.mock('uuid', () => ({ v4: jest.fn() }));

describe('string-utils', () => {
  describe('formatNumber', () => {
    it('форматирует номер по шаблону', () => {
      expect(formatNumber('79991234567')).toBe('7-999-123-45-67');
    });
  });

  describe('translit', () => {
    it('транслитерирует известные символы', () => {
      expect(translit('\u0430\u0431')).toBe('ab');
    });

    it('оставляет неизвестные символы как есть', () => {
      expect(translit('test-123')).toBe('test-123');
    });
  });

  describe('getUniqName', () => {
    it('добавляет uuid-префикс к имени', () => {
      (v4 as jest.Mock).mockReturnValue('uuid');
      expect(getUniqName('file.png')).toBe('uuid-file.png');
    });
  });
});
