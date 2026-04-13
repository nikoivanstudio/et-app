'use server';

import { FC } from 'react';

import { LoadingView } from '@/views/loading/server';

const Loading: FC = async () => <LoadingView />;

export default Loading;
