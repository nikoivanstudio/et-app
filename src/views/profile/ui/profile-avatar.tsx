import { cn } from '@bem-react/classname';
import Image from 'next/image';
import { FC } from 'react';

import { PropsWithClassNames } from '@/shared/model/types';

import mockAvaSrc from '@/views/profile/assets/images/mockAvatar.jpg';

type Props = {
  avatarPhoto?: string;
} & PropsWithClassNames;

const cnProfileAvatar = cn('ProfileAvatar');

export const ProfileAvatar: FC<Props> = ({ avatarPhoto, className }) => (
  <div className={cnProfileAvatar(null, ['w-full', className])}>
    <Image
      className={cnProfileAvatar('Image', ['rounded-full'])}
      src={avatarPhoto || mockAvaSrc}
      alt='Фото профиля'
      width={200}
      height={200}
    />
  </div>
);
