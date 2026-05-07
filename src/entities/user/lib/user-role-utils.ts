import { permissions } from '@/entities/user/constants/permissions';
import { Role } from '@/entities/user/domain';

function userHasPermissionOn(role: string, keyOfPermissions: string): boolean {
  if (!keyOfPermissions || !(keyOfPermissions in permissions)) {
    return false;
  }

  if (role === Role.SUPER_ADMIN) {
    return true;
  }

  return permissions[keyOfPermissions].has(role);
}

export const roleUtils = { userHasPermissionOn };
