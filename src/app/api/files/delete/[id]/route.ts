import { NextRequest } from 'next/server';

import { deleteFile } from '@/features/delete-files/server';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export const DELETE = async (req: NextRequest, { params }: RouteParams) => {
  const { id } = await params;

  return deleteFile(req, id);
};
