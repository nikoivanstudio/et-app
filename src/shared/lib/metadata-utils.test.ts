import { left, right } from './either';
import { getMetadataByEither } from './metadata-utils';

describe('metadata-utils', () => {
  it('возвращает дефолтные мета-данные при ошибке', async () => {
    const metadata = await getMetadataByEither(left('error'));
    expect(metadata.title).toBe('Заголовок страницы');
    expect(metadata.description).toBe('Описание');
  });

  it('возвращает мета-данные из значения', async () => {
    const metadata = await getMetadataByEither(
      right({
        title: 'Title',
        description: 'Desc',
        keywords: ['a', 'b']
      })
    );

    expect(metadata.title).toBe('Title');
    expect(metadata.description).toBe('Desc');
    expect(metadata.keywords).toEqual(['a', 'b']);
  });
});
