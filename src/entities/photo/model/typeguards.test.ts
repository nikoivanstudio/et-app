import { photoTypeguards } from './typeguards';

describe('photoTypeguards.isPhotoEntity', () => {
  it('возвращает true для валидной сущности', () => {
    expect(
      photoTypeguards.isPhotoEntity({
        id: 1,
        title: 't',
        keywords: ['a'],
        source: 's',
        fileName: 'f',
        authorId: 2
      })
    ).toBe(true);
  });

  it('возвращает false для невалидной сущности', () => {
    expect(photoTypeguards.isPhotoEntity({ id: '1' })).toBe(false);
  });
});
