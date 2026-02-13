import { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

type Props = {
  header?: ReactNode;
  fileList?: ReactNode;
  footer?: ReactNode;
};

const cnFilesLibrary = cn('FilesLibrary');

export const FilesLibraryLayout: FC<Props> = ({ header, fileList, footer }) => (
  <section className={`${cnFilesLibrary()} space-y-6`}>
    {header}
    {fileList}
    {footer}
  </section>
);
