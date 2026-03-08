export const DELETE = async () =>
  new Response(
    JSON.stringify('Используйте путь формата /api/files/delete/:id'),
    {
      status: 400,
      statusText: 'Fail'
    }
  );
