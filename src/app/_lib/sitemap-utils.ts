import type { MetadataRoute } from 'next';

export type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]['changeFrequency']
>;

export type SitemapEntry = {
  /** Путь от корня: '/', '/uslugi', '/tour/dzhip-tur-ai-petri'. */
  path: string;
  changeFrequency?: ChangeFrequency;
  priority?: number;
  /**
   * Дата последнего изменения. `null`/`undefined` — тега lastmod у адреса
   * не будет вовсе, и это осознанное поведение.
   *
   * Раньше здесь стояло `new Date(2026, 1, 1)` — одна захардкоженная дата
   * на все без исключения адреса (и, из-за нумерации месяцев с нуля,
   * февраль вместо января). Такой lastmod — одинаковый у всего сайта и не
   * меняющийся от выкладки к выкладке — поисковик признаёт недостоверным
   * и перестаёт учитывать поле целиком. Лучше не выдавать lastmod вообще,
   * чем выдавать выдуманный: у записей из БД он берётся из настоящих
   * updatedAt/createdAt, у статических страниц отсутствует.
   */
  lastModified?: Date | null;
};

/** Дата правки записи: обновление, а если его не было — создание. */
const getLastModified = (entity: {
  updatedAt?: Date | null;
  createdAt?: Date | null;
}): Date | null => entity.updatedAt ?? entity.createdAt ?? null;

/** Убирает повторяющиеся адреса, оставляя первое вхождение. */
const dedupeByPath = (entries: SitemapEntry[]): SitemapEntry[] => {
  const seen = new Set<string>();

  return entries.filter(entry => {
    if (seen.has(entry.path)) {
      return false;
    }

    seen.add(entry.path);

    return true;
  });
};

/**
 * Выбрасывает адреса, занятые другой секцией.
 *
 * Легаси-посты живут в корне (`/{slug}`), поэтому пост со слагом `tours`
 * или `kontakty` дал бы тот же адрес, что статическая страница. Дублей
 * внутри одного файла раньше не было благодаря общей дедупликации, но с
 * разбиением на секции один и тот же адрес мог оказаться в двух файлах
 * сразу — для поисковика это дубль, даже если страница одна.
 */
const excludePaths = (
  entries: SitemapEntry[],
  taken: Iterable<string>
): SitemapEntry[] => {
  const reserved = new Set(taken);

  return entries.filter(entry => !reserved.has(entry.path));
};

export const sitemapUtils = {
  getLastModified,
  dedupeByPath,
  excludePaths
};
