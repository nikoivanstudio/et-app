type HandlerData = {
  body?: unknown;
  status?: number;
  statusText?: string;
  error?: unknown;
};

export function handleSuccess({ body, status, statusText }: HandlerData) {
  return new Response(JSON.stringify(body || 'Успешно'), {
    status: status || 200,
    statusText: statusText || 'OK'
  });
}

export function handleError({ body, status, statusText, error }: HandlerData) {
  let errorMessage = 'Ошибка обработки запроса.';

  if (typeof body === 'string') {
    errorMessage = body;
  } else if (error instanceof Error) {
    errorMessage += ` ${error.message}`;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  console.error(error);

  return new Response(JSON.stringify(errorMessage || 'Неизвестная ошибка'), {
    status: status || 400,
    statusText: statusText || 'Fail'
  });
}
