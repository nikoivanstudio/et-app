import { fileRepository } from '@/entities/file/server';

import { Either, left, right } from '@/shared/lib/either';

import { fileApi } from '../api/file-api';
import {
  FileDto,
  FullUrlDto,
  ShortUrlDto,
  UploadFilePreviewItem
} from '../domain';
import { fileUtils } from '../lib/file-utils';

const saveFilesInfo = async (
  files: FullUrlDto[]
): Promise<Either<string, string>> => {
  const createFilesDto = files.map(fileUtils.fullFileDtoToCreateFileDto);

  const result = await fileRepository.createFiles(createFilesDto);

  if (!result.count) {
    return left('Ошибка при сохранение файлов');
  }

  return right(`Успешно сохранено ${result.count} файлов`);
};

const getPresignedUrlsDto = async (
  fileItems: UploadFilePreviewItem[]
): Promise<ShortUrlDto[]> => {
  const shortFilesDtos = fileItems.map(fileUtils.getShortFileDto);

  const { presignedUrlsDto } =
    await fileApi.getPresignedUrlsDto(shortFilesDtos);

  return presignedUrlsDto;
};

const uploadToFileStorage = async (filesDto: FileDto[]) => {
  const results = await Promise.all(
    filesDto.map(async dto => await fileApi.uploadToS3(dto.url, dto.file))
  );

  const unUploaded = results.filter(res => res.status !== 200);

  if (unUploaded.length) {
    throw new Error('Ошибка при загрузке файлов!');
  }
};

export const fileService = {
  saveFilesInfo,
  getPresignedUrlsDto,
  uploadToFileStorage
};
