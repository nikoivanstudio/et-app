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
