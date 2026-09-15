import { emptyTourEditorData } from '../model/empty';

import {
  buildTourChecklist,
  MIN_TOUR_PHOTOS,
  missingRequired,
  tourCompleteness
} from './checklist';

const filledTour = () => ({
  ...emptyTourEditorData(),
  id: 1,
  title: 'Джип-тур на Ай-Петри из Ялты',
  startCity: 'Ялта',
  durationHours: 7,
  about: 'Поднимаемся на плато по старой военной дороге и заезжаем к водопаду.',
  description:
    'Выезжаем из Ялты в 8:00 от автовокзала. Первая остановка — водопад Учан-Су, дальше подъём по серпантину и смотровая над городом.',
  price: 2500,
  priceUnit: 'PER_PERSON',
  included: ['Внедорожник и топливо'],
  excluded: ['Обед'],
  meetingAddress: 'ул. Московская, 8',
  meetingNote: 'Площадка у касс междугородних рейсов',
  faq: [{ question: 'Дети поедут?', answer: 'Да, с 5 лет.' }],
  photos: [...Array(MIN_TOUR_PHOTOS).keys()].map(index => ({
    id: index + 1,
    title: 'Фото',
    source: `/photo-${index}.jpg`,
    isMain: index === 0
  }))
});

describe('готовность карточки тура', () => {
  it('пустой тур ничего не набирает и не проходит на модерацию', () => {
    const checklist = buildTourChecklist(emptyTourEditorData());

    expect(tourCompleteness(checklist)).toBe(0);
    expect(missingRequired(checklist).length).toBeGreaterThan(0);
  });

  it('заполненный тур готов на 100% и без обязательных пропусков', () => {
    const checklist = buildTourChecklist(filledTour());

    expect(tourCompleteness(checklist)).toBe(100);
    expect(missingRequired(checklist)).toEqual([]);
  });

  it('фотографий меньше минимума — тур на модерацию не пускают', () => {
    const checklist = buildTourChecklist({
      ...filledTour(),
      photos: [{ id: 1, title: 'Фото', source: '/photo.jpg', isMain: true }]
    });

    expect(missingRequired(checklist).map(item => item.id)).toEqual(['photos']);
  });

  it('«что не входит» и FAQ желательны, но не обязательны', () => {
    const checklist = buildTourChecklist({
      ...filledTour(),
      excluded: [],
      faq: []
    });

    expect(missingRequired(checklist)).toEqual([]);
    expect(tourCompleteness(checklist)).toBe(75);
  });
});
