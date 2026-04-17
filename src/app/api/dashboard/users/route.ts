import { patchUser } from '@/features/edit-user/server';
import { deleteUser, getUsers } from '@/features/user/server';

export const GET = getUsers;
export const PATCH = patchUser;
export const DELETE = deleteUser;
