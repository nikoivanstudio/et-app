import { TourEditorData } from './types';

/**
 * Заготовка нового тура: с неё открывается редактор.
 *
 * Лежит отдельно от сервиса, потому что нужна и на сервере (страница
 * «Новый тур»), и в тестах — а сервис тянет за собой хранилище файлов.
 */
export const emptyTourEditorData = (): TourEditorData => ({
  id: null,
  title: '',
  slug: '',
  about: '',
  description: '',
  startCitySlug: '',
  durationHours: 4,
  capacity: null,
  difficulty: '',
  price: 0,
  priceUnit: 'PER_CAR',
  seasons: [],
  categories: [],
  included: [],
  excluded: [],
  faq: [],
  routeStops: [],
  priceOptions: [],
  minGroupSize: null,
  bookingLeadDays: null,
  startTime: '',
  weekdays: [],
  blockedDates: [],
  meetingAddress: '',
  meetingNote: '',
  pickupCitySlugs: [],
  metaTitle: '',
  metaDescription: '',
  photos: [],
  status: null,
  rejectionComment: null,
  updatedAt: null,
  bookedDates: []
});
