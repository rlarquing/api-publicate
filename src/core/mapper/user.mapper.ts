import { Injectable } from '@nestjs/common';
import { RolMapper } from './rol.mapper';
import { FunctionMapper } from './function.mapper';
import {
  ReadFunctionDto,
  ReadRolDto,
  ReadUserDto,
  UpdateUserDto,
  UserDto,
} from '../../shared/dto';
import { UserEntity } from '../../persistence/entity';

@Injectable()
export class UserMapper {
  constructor(
    protected rolMapper: RolMapper,
    protected funcionMapper: FunctionMapper,
  ) {}
  dtoToEntity(userDto: UserDto): UserEntity {
    return new UserEntity(userDto.username, userDto.email);
  }
  dtoToUpdateEntity(
    updateUserDto: UpdateUserDto,
    updateUserEntity: UserEntity,
  ): UserEntity {
    updateUserEntity.username = updateUserDto.username;
    updateUserEntity.email = updateUserDto.email;
    return updateUserEntity;
  }
  async entityToDto(userEntity: UserEntity): Promise<ReadUserDto> {
    const readRolDto: ReadRolDto[] = [];
    for (const rol of userEntity.roles) {
      readRolDto.push(await this.rolMapper.entityToDto(rol));
    }
    const readFuncionDto: ReadFunctionDto[] = [];
    for (const funcion of userEntity.functions) {
      readFuncionDto.push(await this.funcionMapper.entityToDto(funcion));
    }
    const dtoToString: string = userEntity.toString();
    return new ReadUserDto(
      dtoToString,
      userEntity.id,
      userEntity.username,
      userEntity.email,
      readRolDto,
      readFuncionDto,
    );
  }
}
