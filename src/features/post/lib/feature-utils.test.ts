import { getTitleByType } from './feature-utils';

describe('getTitleByType', () => {
  it('возвращает заголовок для редактирования', () => {
    expect(getTitleByType('edit')).toBe('Отредактировать пост');
  });

  it('возвращает заголовок для создания', () => {
    expect(getTitleByType('create')).toBe('Создать пост');
  });
});
