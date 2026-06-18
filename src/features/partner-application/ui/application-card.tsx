'use client';

import {
  CalendarDays,
  Check,
  Hash,
  Mail,
  Phone,
  Shield,
  Star,
  User,
  X
} from 'lucide-react';
import { FC } from 'react';

import { PartnerApplicationDomain } from '@/entities/partner-application';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

import { ApplicationWithUser } from '../domain';

const PENDING = PartnerApplicationDomain.PartnerApplicationStatus.PENDING;

type Props = {
  application: ApplicationWithUser;
  isPending: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [PartnerApplicationDomain.PartnerApplicationStatus.PENDING]: 'secondary',
  [PartnerApplicationDomain.PartnerApplicationStatus.APPROVED]: 'default',
  [PartnerApplicationDomain.PartnerApplicationStatus.REJECTED]: 'destructive'
};

// Дата приходит из API строкой (JSON), форматируем для отображения.
const formatDate = (value: Date | string | null): string | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
};

const InfoRow: FC<{
  icon: FC<{ className?: string }>;
  label: string;
  value?: string | null;
}> = ({ icon: Icon, label, value }) => {
  if (!value) {
    return null;
  }

  return (
    <div className='flex items-center gap-3'>
      <Icon className='h-4 w-4 shrink-0 text-muted-foreground' />
      <span className='text-muted-foreground'>{label}:</span>
      <span className='font-medium'>{value}</span>
    </div>
  );
};

export const ApplicationCard: FC<Props> = ({
  application,
  isPending,
  onApprove,
  onReject
}) => {
  const { user } = application;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <Card className='w-full shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between gap-4 pb-2'>
        <CardTitle className='text-xl'>{user.login}</CardTitle>
        <div className='flex gap-2'>
          <Badge variant='outline'>
            {
              PartnerApplicationDomain.PARTNER_APPLICATION_TYPE_LABELS[
                application.type
              ]
            }
          </Badge>
          <Badge variant={statusVariant[application.status] ?? 'secondary'}>
            {
              PartnerApplicationDomain.PARTNER_APPLICATION_STATUS_LABELS[
                application.status
              ]
            }
          </Badge>
        </div>
      </CardHeader>
      <Separator className='my-2' />
      <CardContent className='grid gap-3 mt-2 text-sm'>
        <InfoRow icon={Hash} label='ID пользователя' value={String(user.id)} />
        <InfoRow icon={User} label='Логин' value={user.login} />
        <InfoRow icon={User} label='Имя' value={fullName} />
        <InfoRow icon={Mail} label='E-mail' value={user.email} />
        <InfoRow icon={Phone} label='Телефон' value={user.phone} />
        <InfoRow icon={Shield} label='Текущая роль' value={user.role} />
        <InfoRow
          icon={Star}
          label='Рейтинг'
          value={user.rating != null ? String(user.rating) : null}
        />
        <InfoRow
          icon={CalendarDays}
          label='Дата регистрации'
          value={formatDate(user.createdAt)}
        />
        <InfoRow
          icon={CalendarDays}
          label='Заявка подана'
          value={formatDate(application.createdAt)}
        />
      </CardContent>

      {application.status === PENDING && (
        <CardFooter className='pt-2 flex gap-2'>
          <Button
            className='flex-1'
            disabled={isPending}
            onClick={() => onApprove(application.id)}
          >
            <Check className='mr-2 h-4 w-4' />
            Одобрить
          </Button>
          <Button
            variant='destructive'
            className='flex-1'
            disabled={isPending}
            onClick={() => onReject(application.id)}
          >
            <X className='mr-2 h-4 w-4' />
            Отклонить
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
