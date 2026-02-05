import { PreProcessFileInfo, PresignedFileInfo } from '@/entities/file/domain';
import { fileUtils } from '@/entities/file/lib/file-utils';
import { fileStorage } from '@/entities/file/storage/file-storage';

const bucketName = 'wp-content';

const getPresignedData = async (
  fileData: PreProcessFileInfo
): Promise<PresignedFileInfo> => {
  const filename = fileUtils.getUniqueFileName(fileData.originalName);
  const url = await fileStorage.getPresignedUrlToUpload({
    bucketName,
    filename
  });

  return { ...fileData, filename, url };
};

export const fileService = { getPresignedData };
