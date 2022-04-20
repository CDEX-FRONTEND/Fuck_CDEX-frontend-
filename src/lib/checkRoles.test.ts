import { UserRoleType } from '../store/userSlice';
import { checkRoles } from './checkRoles';

it('check roles', () => {
  const userRoles: UserRoleType[] = [
    {
      code: 'admin',
      description: '',
      name: '',
    },
  ];
  const roles = ['admin'];

  expect(checkRoles(userRoles, roles)).toBeTruthy();
});
