// Русское склонение существительного по числу: [одна, две-четыре, пять+].
export const plural = (
  count: number,
  forms: [string, string, string]
): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];

  return forms[2];
};

export const reviewsLabel = (count: number): string =>
  `${count} ${plural(count, ['отзыв', 'отзыва', 'отзывов'])}`;

export const toursLabel = (count: number): string =>
  `${count} ${plural(count, ['тур', 'тура', 'туров'])}`;

export const yearsLabel = (count: number): string =>
  `${count} ${plural(count, ['год', 'года', 'лет'])}`;
