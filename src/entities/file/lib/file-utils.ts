import { v4 } from 'uuid';

const getUniqueFileName = (originalName: string): string =>
  `${v4()}-${originalName}`;

export const fileUtils = { getUniqueFileName };
