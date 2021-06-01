import { UserEntity } from '../entities';
export class ResponseUserDto {
    success: boolean;
    data?: UserEntity;
}