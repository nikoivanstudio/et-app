'use client';

import { cn } from '@bem-react/classname';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

const cnProfile = cn('Profile');

export const Profile: FC = () => {
  const onLogout = () => console.log('logOut');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='p-px rounded-full self-center h-8 w-8'
        >
          <Avatar>
            <AvatarFallback>ИН</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cnProfile(null, ['w-56 mr-2'])}>
        <DropdownMenuLabel>
          <p>Мой аккаунт</p>
          <p className='text-xs text-muted-foreground overflow-hidden text-ellipsis'>
            Николаенко
          </p>
        </DropdownMenuLabel>
        <DropdownMenuGroup></DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/profile/1`}>
              <User className='mr-2 h-4 w-4' />
              <span>Профиль</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className='mr-2 h-4 w-4' />
            <span>Выход</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
