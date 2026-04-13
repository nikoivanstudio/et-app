import { NextRequest } from 'next/server';

import { tourRepositories } from '@/entities/tour/server';
import { UserDomain } from '@/entities/user';
import { sessionService } from '@/entities/user/services/session';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function deleteTour(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;
    const tourId = req.nextUrl.searchParams.get('id');

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации. Cookies lost' });
    }

    if (!tourId) {
      return handleError({ body: 'Отсутствует идентификатор тура' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const tour = await tourRepositories.getTour(Number(tourId));

    if (!tour) {
      return handleError({ body: 'Отсутствует идентификатор тура' });
    }

    if (
      session.role !== UserDomain.Role.SUPER_ADMIN &&
      tour.authorId !== session.id
    ) {
      return handleError({ body: 'У вас нет прав на удаление этого тура' });
    }

    const deletedTour = await tourRepositories.deleteTour(Number(tourId));

    if (!deletedTour) {
      return handleError({ body: 'Ошибка при удаление тура' });
    }

    return handleSuccess({ body: deletedTour });
  } catch (error) {
    console.error(error);

    return handleError({ body: 'Ошибка при удаление тура' });
  }
}
