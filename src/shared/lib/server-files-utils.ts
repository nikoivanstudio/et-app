import fs from 'node:fs/promises';
import { revalidatePath } from 'next/cache';

import { getUniqName } from '@/shared/lib/string-utils';

export const saveFileWithPath = async (
  file: File,
  path?: string
): Promise<string | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer: Uint8Array<ArrayBuffer> = new Uint8Array(arrayBuffer);
    const uniqName = getUniqName(file.name);
    const fileSource = `/${path || 'uploads'}/${uniqName}`;

    const directories = await fs.readdir('./public');

    if (!directories.includes(path || 'uploads')) {
      await fs.mkdir(`./public/${path || 'uploads'}`);
    }

    await fs.writeFile(`./public${fileSource}`, buffer);

    revalidatePath('/');

    return fileSource;
  } catch (e) {
    console.error(e);

    return null;
  }
};
