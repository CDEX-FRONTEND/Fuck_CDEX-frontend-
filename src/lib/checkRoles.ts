import { UserRoleType } from '../store/userSlice';

export function checkRoles(
  userRoles: UserRoleType[],
  roles: string[]
): boolean {
  return (
    userRoles.filter(
      (userRole: UserRoleType) => roles.indexOf(userRole.code) !== -1
    ).length !== 0
  );
}
