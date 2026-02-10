import { cn } from './css';

describe('cn', () => {
  it('склеивает классы и учитывает tailwind-merge', () => {
    expect(cn('p-2', 'p-4', 'text-sm')).toBe('p-4 text-sm');
  });
});
