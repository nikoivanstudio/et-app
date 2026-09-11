import { FC } from 'react';

import ekskursiiPhoto from '@/views/legacy/assets/images/ekskursii.jpg';
import { ServiceView } from '@/views/legacy/server';

const service = {
  id: 3,
  slug: 'klassicheskie-ekskursii-po-krymu',
  title: 'Классические экскурсии по Крыму',
  content: 'Классические экскурсии в Крыму',
  mainImage: ekskursiiPhoto,
  images: []
};

export const dynamic = 'force-static';

const LegacyPage: FC = async () => <ServiceView {...service} />;

export default LegacyPage;
