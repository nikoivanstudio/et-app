import { cn } from '@bem-react/classname';
import { FC, ReactNode } from 'react';

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
