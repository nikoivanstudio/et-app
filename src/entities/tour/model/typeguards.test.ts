import { tourTypeguards } from './typeguards';

describe('tourTypeguards.isPhotoEntity (entities)', () => {
  it('возвращает true для валидного объекта', () => {
    expect(
      tourTypeguards.isPhotoEntity({
        title: 't',
        source: 's',
        authorId: 1
      })
    ).toBe(true);
  });

  it('возвращает false для невалидного объекта', () => {
    expect(tourTypeguards.isPhotoEntity({ title: 't' })).toBe(false);
  });
});
