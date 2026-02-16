import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';

import { fileApi } from '../api/file-api';
import {
  FullUrlDto,
  HookConfig,
  SaveFilesInfoResult,
  UploadFilePreviewItem
} from '../domain';
import { fileUtils } from '../lib/file-utils';
import { fileService } from '../services/file-service';

type Props<E> = HookConfig<E> & { userId: number };

export const useUploadFiles = <E = Error>({ userId, ...config }: Props<E>) => {
  const [fileItems, setItems] = useState<UploadFilePreviewItem[]>([]);
  const queryClient = useQueryClient();
  const mutation = useMutation<SaveFilesInfoResult, E, FullUrlDto[]>({
    mutationFn: data => fileApi.saveFilesInfo(data),
    onSuccess: result => {
      queryClient.invalidateQueries({ queryKey: [fileApi.baseKey] });

      config.onSuccess?.(result.result);
    },
    onSettled: (result, error) => {
      config.onSettled?.(result, error);
    },
    onError: error => {
      config.onError?.(error);
    }
  });

  const onChangeFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files?.length) return;

    const fileItems: UploadFilePreviewItem[] = [...files].map(file => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file
    }));

    setItems(prev => [...prev, ...fileItems]);
  };

  const onDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const uploadFiles = async () => {
    const validFiles = fileUtils.filterValidFileItems(fileItems);
    const presignedUrlsDto = await fileService.getPresignedUrlsDto(validFiles);
    const filesDto = fileUtils.getFilesDto(validFiles, presignedUrlsDto);

    await fileService.uploadToFileStorage(filesDto);

    const fullFilesDto = fileUtils.getFullFilesDto(filesDto, userId);

    mutation.mutate(fullFilesDto);
  };

  return {
    fileItems,
    onChangeFiles,
    uploadFiles,
    onDeleteItem,
    isLoading: mutation.isPending
  };
};
