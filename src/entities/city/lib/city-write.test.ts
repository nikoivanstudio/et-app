import { resolveCityWrite } from '@/entities/city/lib/city-write';

const yalta = { id: 4, slug: 'yalta', title: 'Ялта', regionSlug: 'krym' };

describe('запись города в пару «ключ + строка»', () => {
  it('выбранный город пишется из справочника', () => {
    expect(resolveCityWrite(yalta, null)).toEqual({ id: 4, title: 'Ялта' });
  });

  it('снятый город снимает и строку', () => {
    expect(resolveCityWrite(undefined, 4)).toEqual({ id: null, title: null });
  });

  it('несопоставленная строка не трогается', () => {
    // Тур с «Гаспрой» в start_city и без ключа: сохранение цены не должно
    // стирать город с публичной страницы, показать его форма не может.
    expect(resolveCityWrite(undefined, null)).toBeUndefined();
    expect(resolveCityWrite(undefined, undefined)).toBeUndefined();
  });
});
