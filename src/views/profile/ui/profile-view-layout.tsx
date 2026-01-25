import { FC } from 'react';
import { cn } from '@bem-react/classname';
import { ProfileAvatar } from '@/views/profile/ui/profile-avatar';
import Link from 'next/link';
import { permissionsServices } from '@/features/dashboard';
import { Button } from '@/shared/ui/button';
import { sessionService } from '@/entities/user/server';
import { redirect } from 'next/navigation';
import { routes } from '@/kernel/routes';

const cnProfileView = cn('ProfileView');

export const ProfileLayout: FC<{ id: number; role: string }> = ({
  id,
  role
}) => {
  const dashboardLabel =
    role === 'SUPER_ADMIN' ? 'Открыть панель управления' : 'Мои предложения';

  return (
    <main className={cnProfileView(null, ['px-4', 'pt-[15vh]'])}>
      <h1 className='text-center'>Профиль</h1>
      <div className='mt-4'>
        <ProfileAvatar className='flex justify-center' />
      </div>
      {permissionsServices.userHasPermissionsToDashboard(role) && (
        <div className='text-center mt-4'>
          <Button variant='outline'>
            <Link href={`/dashboard/${id}`}>{dashboardLabel}</Link>
          </Button>
        </div>
      )}
      {/*<div className='mt-4'>*/}
      {/*  <form*/}
      {/*    className='text-center'*/}
      {/*    action={async () => {*/}
      {/*      'use server';*/}
      {/*      await makeSuperAdminAction(id);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Button type='submit' variant='outline'>*/}
      {/*      Получить Super Admin*/}
      {/*    </Button>*/}
      {/*  </form>*/}
      {/*</div>*/}
      <div className='mt-4'>
        <form
          className='text-center'
          action={async () => {
            'use server';
            await sessionService.deleteSession();
            redirect(routes.signIn());
          }}
        >
          <Button type='submit' variant='outline'>
            Выйти
          </Button>
        </form>
      </div>
    </main>
  );
};
