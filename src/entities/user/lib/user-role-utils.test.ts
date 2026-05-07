import { Role } from '@/entities/user/domain';
import { roleUtils } from '@/entities/user/lib/user-role-utils';

describe('roleUtils.userHasPermissionOn', () => {
  it('grants SUPER_ADMIN access to any registered permission', () => {
    expect(roleUtils.userHasPermissionOn(Role.SUPER_ADMIN, 'updateTour')).toBe(
      true
    );
    expect(roleUtils.userHasPermissionOn(Role.SUPER_ADMIN, 'editPosts')).toBe(
      true
    );
    expect(roleUtils.userHasPermissionOn(Role.SUPER_ADMIN, 'deleteUser')).toBe(
      true
    );
  });

  it('does not grant access for unknown permissions', () => {
    expect(
      roleUtils.userHasPermissionOn(Role.SUPER_ADMIN, 'missingPermission')
    ).toBe(false);
  });

  it('keeps regular role checks unchanged', () => {
    expect(roleUtils.userHasPermissionOn(Role.ADMIN, 'editPosts')).toBe(true);
    expect(roleUtils.userHasPermissionOn(Role.ADMIN, 'updateTour')).toBe(false);
  });
});
