import { FC } from 'react';

import ekskursiiPhoto from '@/views/legacy/assets/images/ekskursii.jpg';
import { ServiceView } from '@/views/legacy/server';

const service = {
  id: 1,
  slug: 'ekskursii-v-krymu-s-luchshimi-tsenami',
  title: 'Классические экскурсии по Крыму',
  content: 'Классические экскурсии в Крыму',
  mainImage: ekskursiiPhoto,
  images: []
};

export const dynamic = 'force-static';

const LegacyPage: FC = async () => <ServiceView {...service} />;

export default LegacyPage;
