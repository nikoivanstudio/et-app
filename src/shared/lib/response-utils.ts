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

/**
 * Обработка ошибок (MED-7).
 *
 * Было: к тексту ответа приклеивался `error.message`, то есть внутренние
 * сообщения (в том числе от драйвера БД и клиента хранилища) уходили клиенту.
 * Кроме того, любой отказ возвращался с кодом 400, включая отказы авторизации,
 * из-за чего атаки было невозможно отличить от обычных ошибок в мониторинге.
 *
 * Стало: клиенту уходит либо явно заданное сообщение, либо обобщённый текст.
 * Подробности пишутся только в журнал сервера.
 */
export function handleError({ body, status, statusText, error }: HandlerData) {
  const errorMessage =
    typeof body === 'string' ? body : 'Ошибка обработки запроса.';

  if (error !== undefined) {
    console.error(error);
  }

  return new Response(JSON.stringify(errorMessage), {
    status: status || 400,
    statusText: statusText || 'Fail'
  });
}

/** Не аутентифицирован: сессии нет, она истекла или отозвана. */
export function handleUnauthorized(message = 'Ошибка верификации') {
  return new Response(JSON.stringify(message), {
    status: 401,
    statusText: 'Unauthorized'
  });
}

/** Аутентифицирован, но прав на действие нет. */
export function handleForbidden(message = 'Недостаточно прав') {
  return new Response(JSON.stringify(message), {
    status: 403,
    statusText: 'Forbidden'
  });
}
