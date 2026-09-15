/**
 * Демо-данные кабинета гида — для локальной разработки.
 *
 * Кабинет (docs/design/canvas, артборды Guide*) без данных выглядит одинаково
 * пустым на всех шести экранах, и проверить вёрстку заявок, переписки и
 * статусов туров нечем. Скрипт наполняет ОДНОГО гида: пять туров с разными
 * статусами, семь заявок по всей цепочке статусов, переписки и отзывы.
 *
 * Запуск: npx tsx prisma/scripts/seed-guide-cabinet.ts [--guide=568]
 *
 * Всё созданное помечено slug'ом `demo-` и при повторном запуске удаляется:
 * на боевой базе такие туры не появляются, а если появились — их видно.
 */
import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import { dbClient } from '../../src/shared/lib/db';

const GUIDE_ID = Number(
  process.argv.find(arg => arg.startsWith('--guide='))?.split('=')[1] ?? 568
);
const day = (offset: number, hour = 9) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const TOURS = [
  { title: 'Джип-тур на Ай-Петри из Ялты', slug: 'demo-ai-petri-yalta', status: 'APPROVED', price: 2500, priceUnit: 'PER_PERSON', duration: 25200, startCity: 'Ялта', capacity: 8, difficulty: 'EASY', seasons: [], rejection: null },
  { title: 'Пещерный город Эски-Кермен. Джип-экскурсия', slug: 'demo-eski-kermen', status: 'APPROVED', price: 7000, priceUnit: 'PER_CAR', duration: 25200, startCity: 'Бахчисарай', capacity: 6, difficulty: 'MEDIUM', seasons: [], rejection: null },
  { title: 'Джип-тур Марсианское озеро, Сфинксы и крепость', slug: 'demo-marsianskoe', status: 'APPROVED', price: 6500, priceUnit: 'PER_CAR', duration: 18000, startCity: 'Бахчисарай', capacity: 6, difficulty: 'EASY', seasons: [4,5,6,7,8,9,10], rejection: null },
  { title: 'Путь к Сюйреньской крепости', slug: 'demo-suyren', status: 'PENDING', price: 8000, priceUnit: 'PER_CAR', duration: 21600, startCity: 'Бахчисарай', capacity: 6, difficulty: 'MEDIUM', seasons: [4,5,6,7,8,9,10], rejection: null },
  { title: 'Зимой на Ай-Петри из Симферополя', slug: 'demo-winter-ai-petri', status: 'REJECTED', price: 9500, priceUnit: 'PER_CAR', duration: 28800, startCity: 'Симферополь', capacity: 6, difficulty: 'MEDIUM', seasons: [12,1,2,3], rejection: 'Нет фотографии точки старта и не заполнено «что входит в цену». Исправьте и отправьте снова.' }
];

const BOOKINGS = [
  { name: 'Мария Соловьёва', phone: '+7 978 788-07-53', email: 'm.solovieva@mail.ru', people: 4, status: 'NEW', tour: 0, date: day(8), comment: 'Хотим выехать пораньше, с нами двое детей', verified: true, messages: [['CLIENT','Здравствуйте! Нас четверо, двое детей — 7 и 9 лет. Подъём им по силам?'],['GUIDE','Добрый день! Маршрут детям подходит: едем на внедорожнике, пешком только смотровая — минут двадцать.'],['CLIENT','Отлично. Выезд из Ялты в 8 утра подойдёт?']] },
  { name: 'Константин Ли', phone: '+7 949 363-10-34', email: null, people: 9, status: 'NEW', tour: 1, date: day(16), comment: 'Нас девять, поместимся в одну машину?', verified: false, messages: [['CLIENT','Нас девять, поместимся в одну машину?']] },
  { name: 'Пётр Иванченко', phone: '+7 905 862-20-09', email: 'petr@mail.ru', people: 2, status: 'CONTACTED', tour: 2, date: day(8), comment: null, verified: true, messages: [['GUIDE','Пётр, добрый день! Подтверждаю дату, выезжаем в 8:30.'],['CLIENT','Спасибо, всё понятно']] },
  { name: 'Дмитрий Кравцов', phone: '+7 927 872-48-85', email: null, people: 5, status: 'CONFIRMED', tour: 1, date: day(3), comment: 'Приедем на своей машине до Бахчисарая', verified: true, messages: [['GUIDE','Отправил точку старта на карте']] },
  { name: 'Елизавета Дорн', phone: '+7 985 114-43-25', email: null, people: 4, status: 'CONFIRMED', tour: 0, date: day(0, 9), comment: null, verified: true, messages: [] },
  { name: 'Артём Гринёв', phone: '+7 981 544-09-98', email: null, people: 3, status: 'CANCELLED', tour: 2, date: day(-10), comment: null, verified: true, cancelReason: 'Не согласовали дату', messages: [] },
  { name: 'Ольга Ким', phone: '+7 918 100-20-30', email: null, people: 2, status: 'COMPLETED', tour: 1, date: day(-20), comment: null, verified: true, messages: [] }
];

async function main() {
  const author = await dbClient.user.findUniqueOrThrow({ where: { id: GUIDE_ID } });
  console.log('гид:', author.login);

  await dbClient.user.update({
    where: { id: GUIDE_ID },
    data: {
      firstName: 'Иван', lastName: 'Николаенко', slug: 'demo-ivan-nikolaenko',
      headline: 'Джип-туры по Крыму с 2014 года. Внедорожник, горы, пещерные города.',
      bio: 'Вожу группы по Крыму двенадцатый сезон. Свой Mitsubishi Pajero на шесть мест: плато Ай-Петри, пещерные города Бахчисарайского района, Марсианское озеро и крепости Севастополя.\n\nБеру семьи с детьми: темп спокойный, пешие участки короткие, в машине детское кресло.',
      city: 'Ялта', vehicle: 'Mitsubishi Pajero, 6 мест, кондиционер, детское кресло',
      languages: ['Русский', 'Английский'], specializations: ['Джиппинг', 'Пещерные города', 'Туры с детьми'],
      experienceSince: 2014, phone: author.phone ?? '+7 978 788-07-53', email: author.email ?? 'ivan@extreme-sport.ru'
    }
  });

  // Сносим прежние демо-туры вместе со всем, что на них висит.
  const old = await dbClient.tour.findMany({ where: { authorId: GUIDE_ID, slug: { startsWith: 'demo-' } }, select: { id: true } });
  const oldIds = old.map(t => t.id);
  if (oldIds.length) {
    await dbClient.message.deleteMany({ where: { booking: { tourId: { in: oldIds } } } });
    await dbClient.booking.deleteMany({ where: { tourId: { in: oldIds } } });
    await dbClient.review.deleteMany({ where: { tourId: { in: oldIds } } });
    await dbClient.photo.deleteMany({ where: { tourId: { in: oldIds } } });
    await dbClient.tour.deleteMany({ where: { id: { in: oldIds } } });
  }

  const tourIds: number[] = [];
  for (const t of TOURS) {
    const photo = await dbClient.photo.create({
      data: { title: t.title, keywords: [], source: '/logo.png', fileName: 'demo.png', authorId: GUIDE_ID }
    });
    const tour = await dbClient.tour.create({
      data: {
        title: t.title, slug: t.slug, description: 'Демо-тур для проверки кабинета.',
        descriptionText: 'Демо-тур для проверки кабинета.',
        content: { lead: 'Поднимаемся на плато по старой военной дороге, заезжаем к водопаду и зубцам.', tags: [], routeStops: [], tickets: [], info: [], awaitsParagraphs: [], awaitsHighlights: [] },
        mainPhotoId: photo.id, price: t.price, priceUnit: t.priceUnit, duration: t.duration,
        categories: ['dzhip-tury'], metaKeywords: [], tags: [], tourRoute: [], authorId: GUIDE_ID,
        status: t.status, rejectionComment: t.rejection, startCity: t.startCity, capacity: t.capacity,
        difficulty: t.difficulty, seasons: t.seasons, rating: 4.9,
        included: ['Внедорожник и топливо', 'Услуги гида-водителя', 'Экологический сбор'],
        excluded: t.status === 'REJECTED' ? [] : ['Обед', 'Входные билеты'],
        faq: [{ question: 'Дети поедут?', answer: 'Да, маршрут подходит детям с 5 лет.' }],
        startTime: '08:00', weekdays: [1,2,3,4,5,6], bookingLeadDays: 2, minGroupSize: 2,
        meetingAddress: 'ул. Московская, 8, автовокзал',
        meetingNote: 'Площадка у касс междугородних рейсов, ориентир — синий внедорожник с наклейкой Energy Tour.',
        pickupCities: ['Алупка', 'Гаспра'], blockedDates: [day(10), day(11)]
      }
    });
    await dbClient.photo.update({ where: { id: photo.id }, data: { tourId: tour.id } });
    tourIds.push(tour.id);
  }

  for (const b of BOOKINGS) {
    const booking = await dbClient.booking.create({
      data: {
        tourId: tourIds[b.tour], guideId: GUIDE_ID, guestName: b.name, guestPhone: b.phone,
        guestEmail: b.email, desiredDate: b.date, peopleCount: b.people, comment: b.comment,
        status: b.status, accessToken: randomUUID(), phoneVerified: b.verified,
        cancelReason: (b as { cancelReason?: string }).cancelReason ?? null,
        statusHistory: [
          { status: 'NEW', at: day(-2, 10).toISOString(), note: 'Заявка создана с карточки тура' },
          ...(b.status === 'NEW' ? [] : [{ status: b.status, at: day(-1, 11).toISOString(), byRole: 'GUIDE' }])
        ],
        createdAt: day(-2, 10)
      }
    });

    for (const [role, text] of b.messages) {
      await dbClient.message.create({
        data: { bookingId: booking.id, authorRole: role, text,
          authorId: role === 'GUIDE' ? GUIDE_ID : null,
          readAt: role === 'GUIDE' ? new Date() : null }
      });
    }
  }

  // Отзывы: два с ответом, два без.
  const client = await dbClient.user.findFirst({ where: { role: 'USER' } });
  if (client) {
    const reviews = [
      { tour: 1, value: 5, content: 'Всё понравилось: спокойный темп, интересный маршрут и очень уверенная подача материала.', reply: 'Артём, спасибо! Ждём вас на Марсианском озере.' },
      { tour: 0, value: 5, content: 'Дорога длинная, но гид держал темп и атмосферу. На гору поднялись без суеты.', reply: null },
      { tour: 2, value: 4, content: 'Маршрут насыщенный, по организации всё чётко. Не хватило времени на само озеро.', reply: null }
    ];
    for (const r of reviews) {
      await dbClient.review.create({
        data: { tourId: tourIds[r.tour], authorId: client.id, content: r.content,
          estimateValue: r.value,
          estimation: { guideWork: 5, informationQuality: r.value, trailQuality: r.value },
          guideReply: r.reply, guideReplyAt: r.reply ? new Date() : null }
      });
    }
  }

  console.log('готово: туров', tourIds.length, 'заявок', BOOKINGS.length);
  process.exit(0);
}

main();
