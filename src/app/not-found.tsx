import type { Metadata } from 'next';

import { buildNoindexMetadata } from '@/shared/lib/seo/page-metadata';

// Страница отдаётся с кодом 404, но noindex здесь — дешёвая страховка:
// если какой-то маршрут всё же дострелит до неё со статусом 200, в индекс
// она всё равно не попадёт.
export const metadata: Metadata = buildNoindexMetadata('Страница не найдена');

export default function NotFoundPage() {
  return (
    <main className='container py-10'>
      <h1 className='text-2xl font-semibold'>Страница не найдена</h1>
      <p className='mt-3 text-muted-foreground'>
        Запрошенная страница отсутствует или была перемещена.
      </p>
    </main>
  );
}
