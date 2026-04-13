export const dashboardNavItems = [
  { id: 'orders', label: 'Заказы' },
  { id: 'crm', label: 'CRM' },
  { id: 'tours', label: 'Туры' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'profile', label: 'Профиль' },
  { id: 'tour-editor', label: 'Создание/редактирование тура' }
] as const;

export const orderTabs = [
  'Текущие',
  'Сертификаты',
  'Успешные',
  'Отмененные',
  'Архив'
] as const;

export const orders = [
  {
    id: '7844',
    date: '14.09.25',
    time: '10:00',
    tour: 'Пещерный город Эски-Кермен',
    client: 'Дмитрий',
    phone: '+7 927 872 48 85',
    guests: 5,
    duration: '7 часов',
    status: 'confirmed',
    income: '11 050 ₽',
    payout: '11 050 ₽'
  },
  {
    id: '7664',
    date: '01.08.25',
    time: '11:00',
    tour: 'Джип-тур Марсианское озеро',
    client: 'Петр',
    phone: '+7 905 862 20 09',
    guests: 6,
    duration: '5 часов',
    status: 'pending',
    income: '8 500 ₽',
    payout: '8 500 ₽'
  },
  {
    id: '7370',
    date: '16.07.25',
    time: '09:30',
    tour: 'Фиолент и крепость Чембало',
    client: 'Елизавета',
    phone: '+7 985 114 43 25',
    guests: 4,
    duration: '6 часов',
    status: 'confirmed',
    income: '8 925 ₽',
    payout: '8 925 ₽'
  },
  {
    id: '7018',
    date: '22.06.25',
    time: '10:00',
    tour: 'Ай-Петри зимой из Севастополя',
    client: 'Артем',
    phone: '+7 981 544 09 98',
    guests: 4,
    duration: '6 часов',
    status: 'paid',
    income: '12 750 ₽',
    payout: '12 750 ₽'
  },
  {
    id: '7045',
    date: '09.06.25',
    time: '11:00',
    tour: 'Три крепости на джипах',
    client: 'Константин',
    phone: '+7 949 363 10 34',
    guests: 9,
    duration: '5 часов',
    status: 'confirmed',
    income: '17 000 ₽',
    payout: '17 000 ₽'
  }
] as const;

export const tours = [
  {
    id: 'tour-1',
    title: 'Пещерный город Эски-Кермен. Джип-экскурсия',
    status: 'Активен',
    online: true,
    location: 'Бахчисарай',
    duration: '7 часов',
    price: 'от 7 000 ₽',
    image: 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.28),_transparent_35%),linear-gradient(135deg,_#365314,_#1f2937)]'
  },
  {
    id: 'tour-2',
    title: 'Джип-тур Марсианское озеро, Сфинксы и Крепость',
    status: 'Активен',
    online: true,
    location: 'Бахчисарай',
    duration: '5 часов',
    price: 'от 6 500 ₽',
    image: 'bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.3),_transparent_35%),linear-gradient(135deg,_#164e63,_#1f2937)]'
  },
  {
    id: 'tour-3',
    title: 'Путь к Сюйреньской крепости. Джипы и Бахчисарай',
    status: 'Активен',
    online: true,
    location: 'Крым',
    duration: '6 часов',
    price: 'от 8 000 ₽',
    image: 'bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.26),_transparent_35%),linear-gradient(135deg,_#14532d,_#111827)]'
  },
  {
    id: 'tour-4',
    title: 'Зимой на Ай-Петри из Симферополя',
    status: 'Выключен',
    online: false,
    location: 'Симферополь',
    duration: '8 часов',
    price: 'от 9 500 ₽',
    image: 'bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.3),_transparent_35%),linear-gradient(135deg,_#334155,_#0f172a)]'
  }
] as const;

export const reviews = [
  {
    id: 'review-1',
    date: '11.06.2024',
    author: 'Артем',
    city: 'Санкт-Петербург',
    order: '№36897',
    tour: 'Пещерный город Чуфут-Кале. Экскурсия на джипах',
    text: 'Все понравилось: спокойный темп, интересный маршрут и очень уверенная подача материала.',
    rating: 5
  },
  {
    id: 'review-2',
    date: '13.02.2023',
    author: 'Ксения',
    city: 'Омск',
    order: '№56553',
    tour: 'Ай-Петри зимой из Севастополя. Лыжи и сноуборд',
    text: 'Дорога была длинной, но гид держал темп и атмосферу. На гору поднялись без суеты.',
    rating: 5
  },
  {
    id: 'review-3',
    date: '22.01.2023',
    author: 'Людмила',
    city: 'Казань',
    order: '№56551',
    tour: 'Пещерный город Чуфут-Кале. Экскурсия на джипах',
    text: 'Подача материала аккуратная, маршрут насыщенный, по организации все четко.',
    rating: 5
  },
  {
    id: 'review-4',
    date: '24.07.2022',
    author: 'Дарья',
    city: 'Сочи',
    order: '№51735',
    tour: 'Джип-тур Марсианское озеро, Сфинксы и Крепость',
    text: 'Отдельно отметили безопасность на маршруте и хороший баланс между обзором и прогулкой.',
    rating: 4
  }
] as const;

export const editorSections = [
  { id: 'settings', label: 'Настройки' },
  { id: 'description', label: 'Описание' },
  { id: 'pricing', label: 'Цены' },
  { id: 'calendar', label: 'Календарь' },
  { id: 'photos', label: 'Фото' },
  { id: 'meeting-point', label: 'Место старта' }
] as const;

export const editorGallery = [
  'Развалины храма',
  'Судилище',
  'Одна из пещер Эски-Кермен',
  'Главная улица пещерного города',
  'Видовая точка маршрута',
  'Окна пещер Эски-Кермена'
] as const;

