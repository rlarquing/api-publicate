import { Injectable } from '@nestjs/common';
import { FunctionMapper } from './function.mapper';
import {
  FunctionRepository,
  RolRepository,
  UserRepository,
} from '../../persistence/repository';
import { FunctionEntity, RolEntity, UserEntity } from '../../persistence/entity';
import {
  CreateRolDto,
  ReadFunctionDto,
  ReadRolDto,
  ReadUserDto,
  SelectDto,
  UpdateRolDto,
} from '../../shared/dto';

@Injectable()
export class RolMapper {
  constructor(
    protected rolRepository: RolRepository,
    protected userRepository: UserRepository,
    protected funcionRepository: FunctionRepository,
    protected funcionMapper: FunctionMapper,
  ) {}
  async dtoToEntity(createRolDto: CreateRolDto): Promise<RolEntity> {
    let users: UserEntity[] = [];
    if (createRolDto.users != undefined) {
      users = await this.userRepository.findByIds(createRolDto.users);
    }
    let funcions: FunctionEntity[] = [];
    if (createRolDto.functions != undefined) {
      funcions = await this.funcionRepository.findByIds(createRolDto.functions);
    }
    return new RolEntity(
      createRolDto.name,
      createRolDto.description,
      funcions,
      users,
    );
  }
  async dtoToUpdateEntity(
    updateRolDto: UpdateRolDto,
    updateRolEntity: RolEntity,
  ): Promise<RolEntity> {
    if (updateRolDto.users != undefined) {
      const users: UserEntity[] = await this.userRepository.findByIds(
        updateRolDto.users,
      );
      if (users) {
        updateRolEntity.users = users;
      }
    }
    if (updateRolDto.functions !== undefined) {
      updateRolEntity.functions = await this.funcionRepository.findByIds(
        updateRolDto.functions,
      );
    }

    updateRolEntity.name = updateRolDto.name;
    updateRolEntity.description = updateRolDto.description;

    return updateRolEntity;
  }
  async entityToDto(rolEntity: RolEntity): Promise<ReadRolDto> {
    const rol: RolEntity = await this.rolRepository.findById(rolEntity.id);
    const selectUserDto: SelectDto[] = [];
    for (const user of rol.users) {
      selectUserDto.push({ label: user.username, value: user.id });
    }
    const readFuncionDto: ReadFunctionDto[] = [];
    for (const funcion of rol.functions) {
      readFuncionDto.push(await this.funcionMapper.entityToDto(funcion));
    }
    const dtoToString: string = rol.toString();
    return new ReadRolDto(
      dtoToString,
      rolEntity.id,
      rolEntity.name,
      rolEntity.description,
      selectUserDto,
      readFuncionDto,
    );
  }
}
