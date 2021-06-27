import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export enum AppResource {
  USER = 'USER',
  POST = 'POST'
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  // POST Roles
  .grant(AppRoles.CLIENT)
  .readOwn([AppResource.USER])
  .updateOwn([AppResource.USER])
  .deleteOwn([AppResource.USER])
  .readOwn([AppResource.POST])
  .createOwn([AppResource.POST])
  .updateOwn([AppResource.POST])
  .deleteOwn([AppResource.POST])

  // Admin Roles
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.CLIENT)
  .readAny([AppResource.POST, AppResource.USER])
  .createAny([AppResource.POST, AppResource.USER])
  .updateAny([AppResource.POST, AppResource.USER])
  .deleteAny([AppResource.POST, AppResource.USER]);
