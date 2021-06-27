import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export enum AppResource {
  USER = 'USER',
  GAME = 'GAME'
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  // CLIENT Roles
  .grant(AppRoles.CLIENT)
  .readOwn([AppResource.USER])
  .updateOwn([AppResource.USER])
  .deleteOwn([AppResource.USER])
  .readOwn([AppResource.GAME])
  .createOwn([AppResource.GAME])
  .updateOwn([AppResource.GAME])
  .deleteOwn([AppResource.GAME])

  // Admin Roles
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.CLIENT)
  .readAny([AppResource.GAME, AppResource.USER])
  .createAny([AppResource.GAME, AppResource.USER])
  .updateAny([AppResource.GAME, AppResource.USER])
  .deleteAny([AppResource.GAME, AppResource.USER]);
