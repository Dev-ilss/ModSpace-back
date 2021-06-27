import { UserFindOne } from './interfaces';
import { CreateUserDto, EditUserDto } from './dtos';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    const data = await this.userRepository.find({ relations: ['games'] });
    if (data.length == 0) {
      throw new NotFoundException('Users not found');
    }
    return data;
  }

  async getUser(id: number, userEntity?: UserEntity): Promise<UserEntity> {
    const user = await this.userRepository
      .findOne(id, { relations: ['games'] })
      .then((user) => (!userEntity ? user : !!user && userEntity.id === user.id ? user : null));
    if (!user) {
      throw new NotFoundException('User does not exists or unauthorized');
    }
    return user;
  }

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const userExists = await this.userRepository.findOne({ email: dto.email });
    if (userExists) throw new BadRequestException('User already registered with email');

    const newUser = this.userRepository.create(dto);
    if (!newUser) {
      throw new NotFoundException('User not created');
    }
    const user = await this.userRepository.save(newUser);
    delete user.password;
    return user;
  }

  async editUser(id: number, dto: EditUserDto, userEntity?: UserEntity): Promise<UserEntity> {
    const finded = await this.getUser(id, userEntity);

    const editedUser = Object.assign(finded, dto);
    const user = await this.userRepository.save(editedUser);

    if (!user) {
      throw new NotFoundException('User not updated');
    }
    delete user.password;
    // delete user.roles;
    return user;
  }

  async deleteUser(id: number, userEntity?: UserEntity): Promise<UserEntity> {
    const user = await this.getUser(id, userEntity);
    const data = await this.userRepository.remove(user);
    if (!data) {
      throw new NotFoundException('User not deleted');
    }
    return data;
  }

  async findUser(data: UserFindOne): Promise<any> {
    return await this.userRepository.createQueryBuilder('user').where(data).addSelect('user.password').getOne();
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.softRemove(user);
  }

  async recover(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, withDeleted: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.recover(user);
  }
}
