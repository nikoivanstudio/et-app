'use server';

import { FC } from 'react';

import { GuideView } from '@/views/guide/server';

type Props = {
  params: Promise<{ slug: string }>;
};

const GuidePage: FC<Props> = async props => <GuideView {...props} />;

export default GuidePage;
