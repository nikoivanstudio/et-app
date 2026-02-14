import { File, Prisma } from '../../../../generated/prisma/client';
import { BatchPayload } from '../../../../generated/prisma/internal/prismaNamespace';
import { FileSelect } from '../../../../generated/prisma/models/File';
import { CreateFileDTO, UpdateFileDTO } from '../domain';

import { dbClient } from '@/shared/lib/db';

const getFile = (id: number, select?: FileSelect) =>
  dbClient.file.findUnique({ where: { id }, select });

const getFiles = <T extends Prisma.FileFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.FileFindManyArgs>
): Promise<Prisma.FileGetPayload<T>[]> => dbClient.file.findMany(args);

const createFile = (file: CreateFileDTO): Promise<File> =>
  dbClient.file.create({ data: file });

const createFiles = (files: CreateFileDTO[]): Promise<BatchPayload> =>
  dbClient.file.createMany({ data: files });

const updateFile = (file: UpdateFileDTO): Promise<File> =>
  dbClient.file.update({
    where: {
      id: file.id
    },
    data: file
  });

const deleteFile = (id: number): Promise<File> =>
  dbClient.file.delete({ where: { id } });

export const fileRepository = {
  getFile,
  getFiles,
  createFile,
  createFiles,
  updateFile,
  deleteFile
};
