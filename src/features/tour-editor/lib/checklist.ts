import { TourEditorData } from '../model/types';

/**
 * Готовность карточки тура.
 *
 * Один и тот же список показывается и в редакторе (правая колонка), и
 * в списке туров («карточка заполнена на 64%»), и он же решает, можно ли
 * отправлять тур на модерацию. Проверяются ровно те поля, из которых
 * собирается публичная страница: без них она выходит куцей, и именно из-за
 * них туры возвращаются с проверки.
 */
export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  /** Без этого на модерацию нельзя. */
  required: boolean;
};

export const MIN_TOUR_PHOTOS = 3;

export const buildTourChecklist = (tour: TourEditorData): ChecklistItem[] => [
  {
    id: 'basics',
    label: 'Название, город и длительность',
    done: tour.title.length >= 10 && !!tour.startCitySlug && tour.durationHours > 0,
    required: true
  },
  {
    id: 'about',
    label: 'Короткое описание и программа',
    done: tour.about.trim().length >= 40 && tour.description.trim().length >= 80,
    required: true
  },
  {
    id: 'price',
    label: 'Цена и за что она',
    done: tour.price > 0 && !!tour.priceUnit,
    required: true
  },
  {
    id: 'included',
    label: 'Что входит в цену',
    done: tour.included.length > 0,
    required: true
  },
  {
    id: 'excluded',
    label: 'Что не входит',
    done: tour.excluded.length > 0,
    required: false
  },
  {
    id: 'photos',
    label: `Фотографии — минимум ${MIN_TOUR_PHOTOS}`,
    done: tour.photos.length >= MIN_TOUR_PHOTOS,
    required: true
  },
  {
    id: 'meeting',
    label: 'Точка старта и как добраться',
    done: !!tour.meetingAddress && !!tour.meetingNote,
    required: true
  },
  {
    id: 'faq',
    label: 'Хотя бы один вопрос в FAQ',
    done: tour.faq.length > 0,
    required: false
  }
];

/** Доля заполненного — целое число процентов. */
export const tourCompleteness = (items: ChecklistItem[]): number =>
  items.length
    ? Math.round((items.filter(item => item.done).length / items.length) * 100)
    : 0;

/** Чего не хватает для отправки на модерацию. */
export const missingRequired = (items: ChecklistItem[]): ChecklistItem[] =>
  items.filter(item => item.required && !item.done);
