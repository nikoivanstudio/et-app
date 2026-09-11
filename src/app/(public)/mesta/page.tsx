import { FC } from 'react';

import { placeServices } from '@/kernel/place/server';
import { PlacesView } from '@/views/places/server';

/**
 * ISR на сутки: список объектов меняется реже, чем раз в день, а
 * динамический рендер здесь означал бы запрос к базе на каждый заход
 * робота — ровно та проблема, из-за которой все 868 страниц собирались
 * заново на каждый запрос (D3).
 */
export const revalidate = 86400;

const Page: FC = async () => {
  const places = await placeServices.getPublishedPlaces();

  return <PlacesView places={places} />;
};

export default Page;
