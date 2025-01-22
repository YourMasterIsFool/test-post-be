import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'roles';

export const RolesDecorator = (...roles: string[]) =>
  SetMetadata(ROLE_KEY, roles);
