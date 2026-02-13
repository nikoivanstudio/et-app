'use client';

import { FC } from 'react';
import { Search, Trash2, Upload } from 'lucide-react';
import { SessionDomain } from '@/entities/user/server';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { FilesLibraryLayout } from '@/widgets/files-library/ui/layout';

import { FilesLibraryHeader } from '../ui/header';
import { UploadFile } from '@/features/upload-file';

type Props = {
  session: SessionDomain.SessionEntity;
};

const mockFiles = [
  {
    id: 'f-001',
    name: 'Договор_контрагент_январь.pdf',
    type: 'PDF',
    author: 'Иван Петров',
    date: '11.02.2026',
    size: '1.8 MB'
  },
  {
    id: 'f-002',
    name: 'Отчет_по_проекту.docx',
    type: 'DOCX',
    author: 'Мария Смирнова',
    date: '10.02.2026',
    size: '640 KB'
  },
  {
    id: 'f-003',
    name: 'Схема_архитектуры.png',
    type: 'PNG',
    author: 'Иван Петров',
    date: '08.02.2026',
    size: '2.3 MB'
  }
];

export const FilesLibraryDashboard: FC<Props> = ({ session }) => {
  const totalFiles = mockFiles.length;
  const totalSpace = '4.74 MB';

  return (
    <FilesLibraryLayout
      header={<FilesLibraryHeader />}
      fileList={
        <>
          <UploadFile session={session} />
          <Card>
            <CardHeader className='gap-3'>
              <CardTitle>Файлы</CardTitle>
              <CardDescription>
                Используйте фильтры, чтобы быстро найти нужные материалы.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-5'>
                <div className='relative xl:col-span-2'>
                  <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
                  <Input
                    className='pl-9'
                    placeholder='Поиск по названию файла'
                  />
                </div>
                <Select>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Тип файла' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all-types'>Все типы</SelectItem>
                    <SelectItem value='pdf'>PDF</SelectItem>
                    <SelectItem value='docx'>DOCX</SelectItem>
                    <SelectItem value='png'>PNG</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Автор' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all-authors'>Все авторы</SelectItem>
                    <SelectItem value='ivan'>Иван Петров</SelectItem>
                    <SelectItem value='maria'>Мария Смирнова</SelectItem>
                    <SelectItem value={String(session.id ?? 'current-user')}>
                      Текущий пользователь
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Дата' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all-dates'>Все даты</SelectItem>
                    <SelectItem value='today'>Сегодня</SelectItem>
                    <SelectItem value='week'>Последние 7 дней</SelectItem>
                    <SelectItem value='month'>Последние 30 дней</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='overflow-x-auto rounded-lg border'>
                <div className='min-w-[760px]'>
                  <div className='text-muted-foreground grid grid-cols-[1.6fr_0.6fr_1fr_0.8fr_0.6fr_auto] items-center gap-4 px-4 py-3 text-xs uppercase tracking-wide'>
                    <span>Наименование</span>
                    <span>Тип</span>
                    <span>Автор</span>
                    <span>Дата</span>
                    <span>Размер</span>
                    <span className='text-right'>Действия</span>
                  </div>
                  <Separator />

                  {mockFiles.map((file, index) => (
                    <div key={file.id}>
                      <div className='grid grid-cols-[1.6fr_0.6fr_1fr_0.8fr_0.6fr_auto] items-center gap-4 px-4 py-3 text-sm'>
                        <span className='font-medium'>{file.name}</span>
                        <Badge variant='outline'>{file.type}</Badge>
                        <span>{file.author}</span>
                        <span>{file.date}</span>
                        <span>{file.size}</span>
                        <div className='flex justify-end'>
                          <Button
                            aria-label={`Удалить файл ${file.name}`}
                            size='icon'
                            variant='ghost'
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        </div>
                      </div>
                      {index < mockFiles.length - 1 ? <Separator /> : null}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      }
      footer={
        <Card>
          <CardContent className='grid gap-3 py-1 sm:grid-cols-2'>
            <div className='rounded-lg border p-4'>
              <p className='text-muted-foreground text-sm'>
                Файлов в хранилище
              </p>
              <p className='text-2xl font-semibold'>{totalFiles}</p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='text-muted-foreground text-sm'>Занято места</p>
              <p className='text-2xl font-semibold'>{totalSpace}</p>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
};
