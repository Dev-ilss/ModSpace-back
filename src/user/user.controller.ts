import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, EditUserDto, ResponseUserDto } from './dtos';
import { Auth, User } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource } from 'src/app.roles';
import { UserEntity } from './entities';

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder
    ){}

    // @Auth({
    //     possession: 'any',
    //     action: 'read',
    //     resource: AppResource.USER
    // })
    @Get()
    async getUsers(): Promise<any>{
        const data = await this.userService.getUsers();
        return {
            success: true,
            data
        };
    }

    // @Auth({
    //     possession: 'any',
    //     action: 'read',
    //     resource: AppResource.USER
    // })
    @Get(':id')
    async getUser(
        @Param('id') id: number,
    ): Promise<ResponseUserDto>{
        const data = await this.userService.getUser(id);
        return {
            success: true,
            data
        };
    }

    // @Auth({
    //     possession: 'any',
    //     action: 'create',
    //     resource: AppResource.USER
    // })
    @Post()
    async createUser(
        @Body() dto: CreateUserDto
    ): Promise<ResponseUserDto>{
         const data = await this.userService.createUser(dto);
         return {
             success: true,
             data
         };
        
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResource.USER
    })
    @Put(':id')
    async editUser(
        @Param('id') id: number,
        @Body() dto: EditUserDto,
        @User() user: UserEntity
    ): Promise<ResponseUserDto>{
        let data;
        if(this.rolesBuilder.can(user.roles).updateAny(AppResource.USER).granted){
            //Administrator
            data = await this.userService.editUser(id, dto);
        } else{
            // Client
            data = await this.userService.editUser(id, dto, user);
        }
        return {
            success: true,
            data
        };
    }

    @Auth({
        possession: 'own',
        action: 'delete',
        resource: AppResource.USER
    })
    @Delete(':id')
    async deleteUser(
        @Param('id') id: number,
        @User() user: UserEntity
    ): Promise<any>{
        
        if(this.rolesBuilder.can(user.roles).updateAny(AppResource.USER).granted){
            //Administrator
             await this.userService.deleteUser(id);
        } else{
            // Client
             await this.userService.deleteUser(id, user);
        }
        return {
            success: true,
            message: 'User deleted'
        };
    }
}
