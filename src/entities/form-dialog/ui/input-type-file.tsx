import { CircleX } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

import { InputProps } from '@/entities/form-dialog/domain';
import { ImagesPreview } from '@/entities/form-dialog/ui/images-preview';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export const InputTypeFile = <
  T extends Record<string, unknown> = Record<string, string>
>({
  name,
  onChange,
  type,
  multiple
}: InputProps<T, File[]>) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (files: File[]) => {
    if (type !== 'files') return;

    onChange({ [name]: files });
    setFiles(files);
  };

  const onChangeFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const { type: inputType, files } = e.target;

    if (type !== 'files' || inputType !== 'file' || !files || !files.length)
      return;

    handleFilesChange([...files]);
  };

  const onDeleteFile = (fileName: string) => {
    const filtredFiles = files.filter(file => file.name !== fileName);

    handleFilesChange(filtredFiles);
  };

  return (
    <>
      <Input
        name={name}
        onChange={onChangeFiles}
        type='file'
        multiple={multiple}
      />
      {!!files.length && (
        <>
          <ul>
            {files.map((file, idx) => (
              <li key={idx}>
                <span>{file.name}</span>
                <Button onClick={() => onDeleteFile(file.name)} variant='ghost'>
                  <CircleX />
                </Button>
              </li>
            ))}
          </ul>
          <ImagesPreview files={files} />
        </>
      )}
    </>
  );
};
