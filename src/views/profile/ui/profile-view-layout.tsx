import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC } from 'react';

import { ChangePasswordForm } from '@/features/change-password';
import { permissionsServices } from '@/features/dashboard';

import { PartnerApplicationDomain } from '@/entities/partner-application';
import { Role } from '@/entities/user/domain';
import { sessionService } from '@/entities/user/server';

import { Button } from '@/shared/ui/button';

import { routes } from '@/kernel/routes';
import { ProfileAvatar } from '@/views/profile/ui/profile-avatar';

const cnProfileView = cn('ProfileView');

export const ProfileLayout: FC<{
  id: number;
  role: string;
  applicationStatus?: string | null;
}> = ({ id, role, applicationStatus = null }) => {
  const dashboardLabel =
    role === 'SUPER_ADMIN' ? 'Открыть панель управления' : 'Мои предложения';

  const isUser = role === Role.USER;
  const isPendingApplication =
    applicationStatus ===
    PartnerApplicationDomain.PartnerApplicationStatus.PENDING;

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

      {isUser && (
        <div className='text-center mt-4'>
          {isPendingApplication ? (
            <p className='text-sm text-muted-foreground'>
              Ваша заявка на партнёрство на рассмотрении
            </p>
          ) : (
            <>
              {applicationStatus ===
                PartnerApplicationDomain.PartnerApplicationStatus.REJECTED && (
                <p className='mb-2 text-sm text-destructive'>
                  Предыдущая заявка отклонена. Вы можете подать новую.
                </p>
              )}
              <Button variant='outline'>
                <Link href={routes.becomePartner()}>Стать партнером</Link>
              </Button>
            </>
          )}
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
      <div className='mt-8'>
        <ChangePasswordForm />
      </div>

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
