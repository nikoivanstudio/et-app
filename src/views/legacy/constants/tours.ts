import { LegacyTourCardData } from '@/shared/model/types';

export const longTours: LegacyTourCardData[] = [
  {
    title: 'Джип-тур экскурсия "Сердцем Крыма"',
    img: 'https://energy-tur.ru/wp-content/uploads/2022/05/ozero_tankovoe.jpg',
    duration: '4 часа',
    price: 'от 9000 руб',
    href: '/dzhip-tur-ekskursiya-serdtsem-kryma'
  },
  {
    title: 'Экскурсия в пещерные города Крыма на внедорожнике',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/mangup-ava.jpg',
    duration: '6-7 часов',
    price: 'от 12 500 руб',
    href: '/drevnij-belbek'
  },
  {
    title: 'Экскурсия к Марсианскому Озеру, Сфинксам и Крепости',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/07/bahchisaray-sfinksi-ava.jpg',
    duration: '5 часов',
    price: 'от 9500 руб',
    href: '/sfinksy-krepost-i-marsianskoe-ozero'
  },
  {
    title: 'Индивидуальная экскурсия — Тур «Безлимитный»',
    img: 'https://energy-tur.ru/wp-content/uploads/2021/04/individualnie-ekskursii-po-krymu.jpg',
    duration: '10 часов',
    price: 'от 20 000 руб',
    href: '/individualnaya-ekskursiya-po-krymu-tur-bezlimitnyj'
  },
  {
    title: 'Легенды Мангуп-Кале (расширенная экскурсия)',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/Legendy_Mangup_Kale_not_active.png',
    duration: '4–5 часов',
    price: 'от 8500 руб',
    href: '/legendy-mangup-kale'
  },
  {
    title: 'Путешествие по качинской долине',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/Kacha_not_active.png',
    duration: '5 часов',
    price: 'от 10 500 руб',
    href: '/puteshestvie-po-kachinskoj-doline'
  },
  {
    title:
      'Обзорная экскурсия по Бахчисараю в Крыму с хорошей ценой и отзывами',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/07/bahchisaraiskie-sfinksi_ava.jpg',
    duration: '4 часа',
    price: 'от 9000 руб',
    href: '/tri-religii'
  },
  {
    title: 'Экскурсия и тур по горам Крыма. Это выше Ай-Петри и Демерджи',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/card3.png',
    duration: '5 часов',
    price: 'от 12 500 руб',
    href: '/dzhip-tur-po-vershinam-kryma'
  }
];

export const shortTours: LegacyTourCardData[] = [
  {
    title: 'Экскурсия в пещерный город Чуфут Кале',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/Chufut-Kale-ava.jpg',
    duration: '3 часа',
    price: 'от 7000 руб',
    href: '/chufut-kale-2'
  },
  {
    title: 'Сафари прогулки на внедорожниках и джипах по Крыму в 2026',
    img: 'https://energy-tur.ru/wp-content/uploads/2019/10/dzhip-tur-krym.jpg',
    duration: '1 часов',
    price: 'от 3000 руб',
    href: '/safari-progulki-na-vnedorozhnikah-i-dzhipah-po-krymu-v-2020'
  },
  {
    title: 'Экскурсия в пещерный город Эски Кермен на машине',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/07/eski-kermen-ava.jpg',
    duration: '3 часа',
    price: 'от 7000 руб',
    href: '/eski-kermen-2'
  },
  {
    title: 'Экскурсия в Бельбекский Каньон Крыма и Сюйреньскую крепость',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/syujrenskaya-krepost-ava.jpg',
    duration: '3 часа',
    price: 'от 6000 руб',
    href: '/belbekskij-kanon-i-syujrenskaya-krepost'
  },
  {
    title: 'Экскурсия на джипе в Качи Кальон и Скит Святой Анастасии',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/skit-ava.jpg',
    duration: '3 часа',
    price: 'от 7000 руб',
    href: '/kachi-kalon-i-skit-svyatoj-anastasii'
  },
  {
    title: 'Экскурсия в пещерный город Крыма Мангуп Кале на джипе',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/peseherniy-gorod-mangup-kale.jpg',
    duration: '3 часа',
    price: 'от 7000 руб',
    href: '/mangup-kale'
  },
  {
    title: 'Джип тур на Тепе-Кермен',
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/kartin-1.jpg',
    duration: '3 часа',
    price: 'от 7000 руб',
    href: '/tepe-kermen-2'
  }
];

export const firstPage: LegacyTourCardData[] = [
  longTours[0],
  longTours[3],
  shortTours[1],
  shortTours[2],
  longTours[2],
  shortTours[3],
  shortTours[4],
  {
    title: `По местам "Силы" сокращенный`,
    img: 'https://energy-tur.ru/wp-content/uploads/2018/06/ava.jpg',
    duration: '4 часа',
    price: 'от 9000 руб',
    href: '/po-mestam-sily-sokrashhennyj'
  },
  shortTours[5],
  shortTours[6],
  shortTours[0],
  longTours[4]
];

export const secondPage: LegacyTourCardData[] = [
  { ...longTours[0], title: 'Три крепости' },
  { ...longTours[5], title: 'Путешествие по Качинской долине' },
  {
    ...longTours[6],
    title: `Обзорная экскурсия на джипе. "Бахчисарай - Город трех религий"`
  },
  {
    ...longTours[6],
    title: `Джип тур - "По вершинам Крыма"`
  },
  {
    title: 'Поездки на гору Ай-Петри из Севастополя Симферополя на машине',
    img: 'https://energy-tur.ru/wp-content/uploads/2016/10/P1010094-1-1.jpg',
    duration: '6 часов',
    price: 'от 2500 руб/человека',
    href: '/aj-petri-poezdki-na-goru-dobiraemsya-v-kompanii-i-individualno'
  }
];
