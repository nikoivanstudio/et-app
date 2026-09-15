/** Фотография тура в редакторе. */
export type EditorPhoto = {
  id: number;
  title: string;
  source: string;
  isMain: boolean;
};

export type PriceOption = {
  label: string;
  unit: string;
  durationHours: number;
  price: number;
};

export type FaqItem = { question: string; answer: string };

export type RouteStop = { title: string; sub?: string };

/**
 * Тур в том виде, в каком его правит гид.
 *
 * Отличается от `TourEntity` тем, что это форма, а не карточка: длительность
 * в часах, а не в секундах, даты — строками, фотографии — с отметкой главной.
 */
export type TourEditorData = {
  id: number | null;
  title: string;
  slug: string;
  about: string;
  description: string;
  startCity: string;
  durationHours: number;
  capacity: number | null;
  difficulty: string;
  price: number;
  priceUnit: string;
  seasons: number[];
  categories: string[];
  included: string[];
  excluded: string[];
  faq: FaqItem[];
  routeStops: RouteStop[];
  priceOptions: PriceOption[];
  minGroupSize: number | null;
  bookingLeadDays: number | null;
  startTime: string;
  weekdays: number[];
  blockedDates: string[];
  meetingAddress: string;
  meetingNote: string;
  pickupCities: string[];
  metaTitle: string;
  metaDescription: string;
  photos: EditorPhoto[];
  status: string | null;
  rejectionComment: string | null;
  updatedAt: string | null;
  /** Занятые даты — подтверждённые заявки. Календарь их только показывает. */
  bookedDates: { date: string; guestName: string; peopleCount: number }[];
};
