import { fileApi } from '../api/file-api';
import { FileDto, ShortUrlDto, UploadFilePreviewItem } from '../domain';
import { fileUtils } from '../lib/file-utils';

const getPresignedUrlsDto = async (
  fileItems: UploadFilePreviewItem[]
): Promise<ShortUrlDto[]> => {
  const shortFilesDtos = fileItems.map(fileUtils.getShortFileDto);
  const { presignedUrlsDto } =
    await fileApi.getPresignedUrlsDto(shortFilesDtos);

  if (!Array.isArray(presignedUrlsDto) || !presignedUrlsDto.length) {
    throw new Error('Presigned URL не были получены');
  }

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
  getPresignedUrlsDto,
  uploadToFileStorage
};
