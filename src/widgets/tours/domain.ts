import { TourCardEntity } from '@/features/tour';

/** Заглушка на карточке тура без фотографий (черновик в кабинете). */
export const TOUR_CARD_PHOTO_FALLBACK = '/logo.png';

export type PhotoEntity = {
  id: number;
  source: string;
};

export type DraftTourCardEntity = {
  id: number;
  title: string;
  price: number;
  slug: string;
  rating: number | null;
  duration: number | null;
  mainPhotoId: number | null;
  photos: PhotoEntity[];
};

export function draftTourToTourCardEntity(
  tour: DraftTourCardEntity
): TourCardEntity {
  const { mainPhotoId, photos, ...rest } = tour;

  /**
   * Главного фото может не быть: черновик заводится на первом шаге редактора,
   * когда фотографий ещё нет (mainPhotoId стал необязательным вместе с этим).
   * Раньше здесь бросалось исключение — теперь берём первую фотографию тура,
   * а совсем без фото отдаём заглушку: на карточке лучше логотип, чем падение
   * всего списка из-за одного черновика. Публичный каталог сюда не доходит —
   * в нём только одобренные туры, а их без фото не одобряют.
   */
  const mainPhoto =
    photos.find(photo => photo.id === mainPhotoId)?.source ??
    photos[0]?.source ??
    TOUR_CARD_PHOTO_FALLBACK;

  return { ...rest, mainPhoto };
}
