import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TourStatus } from '@/entities/tour/domain';

import { routes } from '@/kernel/routes';

import { tourEditorApi } from '../api/tour-editor-api';
import { SaveTourPayload } from '../model/schemas';
import { EditorPhoto } from '../model/types';

/**
 * Сохранение черновика.
 *
 * Новый тур после первого сохранения получает id, и адрес меняется с
 * `/tours/new` на `/tours/{id}`: иначе второе нажатие «Сохранить» завело бы
 * второй тур.
 */
export const useSaveTour = (userId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SaveTourPayload) => tourEditorApi.saveTour(payload),
    onSuccess: (result, payload) => {
      queryClient.invalidateQueries({ queryKey: [tourEditorApi.baseKey] });
      toast.success('Черновик сохранён');

      if (!payload.id) {
        router.replace(routes.cabinet.tourEditor(userId, result.id));
      } else {
        router.refresh();
      }
    },
    onError: (error: Error) => toast.error(error.message)
  });

  return { save: mutation.mutateAsync, isSaving: mutation.isPending };
};

export const useTourStatus = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      status
    }: {
      id: number;
      status: TourStatus.PENDING | 'DRAFT';
    }) =>
      tourEditorApi.setStatus({ id, status }),
    onSuccess: (result, variables) => {
      void result;
      queryClient.invalidateQueries({ queryKey: [tourEditorApi.baseKey] });
      toast.success(
        variables.status === TourStatus.PENDING
          ? 'Тур отправлен на проверку'
          : 'Тур снят с публикации'
      );
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message)
  });

  return { setStatus: mutation.mutate, isPending: mutation.isPending };
};

export const useTourActions = (userId: number) => {
  const router = useRouter();

  const remove = useMutation({
    mutationFn: (id: number) => tourEditorApi.deleteTour(id),
    onSuccess: () => {
      toast.success('Тур удалён');
      router.push(routes.cabinet.tours(userId));
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const duplicate = useMutation({
    mutationFn: (id: number) => tourEditorApi.duplicateTour(id),
    onSuccess: result => {
      toast.success('Копия создана');
      router.push(routes.cabinet.tourEditor(userId, result.id));
    },
    onError: (error: Error) => toast.error(error.message)
  });

  return {
    remove: remove.mutate,
    duplicate: duplicate.mutate,
    isPending: remove.isPending || duplicate.isPending
  };
};

type PhotoCallbacks = {
  onAdded: (photos: EditorPhoto[]) => void;
  onMainSet: (photoId: number) => void;
  onRemoved: (photoId: number) => void;
};

/**
 * Фотографии тура.
 *
 * Результат каждой мутации возвращается в форму колбэком: перезапрашивать
 * весь тур ради одной картинки незачем, а перезапрос ещё и затёр бы
 * несохранённые правки на других шагах.
 */
export const useTourPhotos = (
  tourId: number | null,
  { onAdded, onMainSet, onRemoved }: PhotoCallbacks
) => {
  const upload = useMutation({
    mutationFn: (files: File[]) =>
      tourEditorApi.uploadPhotos(tourId as number, files),
    onSuccess: result => onAdded(result.photos),
    onError: (error: Error) => toast.error(error.message)
  });

  const setMain = useMutation({
    mutationFn: (photoId: number) =>
      tourEditorApi.setMainPhoto(tourId as number, photoId),
    onSuccess: result => onMainSet(result.id),
    onError: (error: Error) => toast.error(error.message)
  });

  const remove = useMutation({
    mutationFn: (photoId: number) =>
      tourEditorApi.deletePhoto(tourId as number, photoId),
    onSuccess: result => onRemoved(result.id),
    onError: (error: Error) => toast.error(error.message)
  });

  return {
    upload: upload.mutate,
    setMain: setMain.mutate,
    remove: remove.mutate,
    isUploading: upload.isPending,
    isPending: upload.isPending || setMain.isPending || remove.isPending
  };
};
