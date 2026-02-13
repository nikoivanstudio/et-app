import { ReactNode } from 'react';
import { UploadFileKind } from '../domain';
import { FileImage, FileText, Film } from 'lucide-react';

export const fileKindLabel: Record<UploadFileKind, string> = {
  image: 'Картинка',
  video: 'Видео',
  document: 'Документ'
};

export const fileKindIcon: Record<UploadFileKind, ReactNode> = {
  image: <FileImage className='size-4' />,
  video: <Film className='size-4' />,
  document: <FileText className='size-4' />
};
