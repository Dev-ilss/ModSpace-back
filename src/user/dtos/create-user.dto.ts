import { EnumToString } from '../../common/helpers';
import { IsString, IsInt, IsDate, MaxLength, IsEmail, IsOptional, Min, Max, IsEnum, IsArray, IsBoolean } from 'class-validator';
import { AppRoles } from 'src/app.roles';

/**
 * @ysp0lur
 * @author Raul E. Aguirre H.
 * 
 */
export class CreateUserDto {

    @IsString()
    @MaxLength(30)
    user: string;

    @IsString()
    @MaxLength(150)
    name: string;

    @IsString()
    @MaxLength(150)
    lastName: string;

    @IsEmail()
    @MaxLength(150)
    email: string;

    @IsString()
    @MaxLength(255)
    password: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    tel: string;

    @IsOptional()
    @IsBoolean()
    status: boolean;

    @IsArray()
    @IsEnum(AppRoles, {
        each: true,
        message: `must be a valid role value, ${ EnumToString(AppRoles) }`,
    })
    roles: string[];
}
