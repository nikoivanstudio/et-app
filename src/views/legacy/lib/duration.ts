/** Фильтр каталога по длительности. Длительность в данных — строка вида
 *  «3 часа», «4–5 часов», «10 часов»: берём первое число. */
export const DURATION_BUCKETS = [
  { id: 'all', label: 'Все' },
  { id: 'short', label: 'до 3 часов' },
  { id: 'medium', label: '4–5 часов' },
  { id: 'long', label: 'на весь день' }
] as const;

export type DurationBucketId = (typeof DURATION_BUCKETS)[number]['id'];

export const getDurationBucket = (
  duration: string
): Exclude<DurationBucketId, 'all'> | null => {
  const hours = Number(duration.match(/\d+/)?.[0]);

  if (!hours) {
    return null;
  }
  if (hours <= 3) {
    return 'short';
  }
  if (hours <= 5) {
    return 'medium';
  }

  return 'long';
};
