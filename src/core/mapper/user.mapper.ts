import { Injectable } from '@nestjs/common';
import { RolMapper } from './rol.mapper';
import { FunctionMapper } from './function.mapper';
import {
  ReadFunctionDto, ReadMunicipalityDto, ReadPlanDto, ReadProvinceDto,
  ReadRolDto,
  ReadUserDto,
  UpdateUserDto,
  UserDto,
} from '../../shared/dto';
import { MunicipalityEntity, PlanEntity, ProvinceEntity, UserEntity } from '../../persistence/entity';
import { MunicipalityRepository, PlanRepository, ProvinceRepository } from '../../persistence/repository';
import { PlanMapper } from './plan.mapper';
import { ProvinceMapper } from './province.mapper';
import { MunicipalityMapper } from './municipality.mapper';

@Injectable()
export class UserMapper {
  constructor(
    protected rolMapper: RolMapper,
    protected funcionMapper: FunctionMapper,
    protected planRepository: PlanRepository,
    protected provinceRepository: ProvinceRepository,
    protected municipalityRepository: MunicipalityRepository,
    protected planMapper: PlanMapper,
    protected provinceMapper: ProvinceMapper,
    protected municipalityMapper: MunicipalityMapper,
  ) {}
  async dtoToEntity(userDto: UserDto): Promise<UserEntity> {
    const planEntity: PlanEntity = await this.planRepository.findById(userDto.plan);
    const provinceEntity: ProvinceEntity = await this.provinceRepository.findById(userDto.province);
    const municipalityEntity: MunicipalityEntity = await this.municipalityRepository.findById(userDto.municipality);
    return new UserEntity(userDto.username, userDto.email, userDto.phone, userDto.expire, planEntity,
    provinceEntity,
    municipalityEntity,);
  }
  async dtoToUpdateEntity(
    updateUserDto: UpdateUserDto,
    updateUserEntity: UserEntity,
  ): Promise<UserEntity> {
    updateUserEntity.username = updateUserDto.username;
    updateUserEntity.email = updateUserDto.email;
    const planEntity: PlanEntity = await this.planRepository.findById(updateUserDto.plan);
    const provinceEntity: ProvinceEntity = await this.provinceRepository.findById(updateUserDto.province);
    const municipalityEntity: MunicipalityEntity = await this.municipalityRepository.findById(updateUserDto.municipality);
    updateUserEntity.plan = planEntity;
    updateUserEntity.province = provinceEntity;
    updateUserEntity.municipality = municipalityEntity;
    updateUserEntity.phone = updateUserDto.phone;
    updateUserEntity.expire = updateUserDto.expire;

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
    const readPlanDto: ReadPlanDto = await this.planMapper.entityToDto(userEntity.plan)
    const readProvinceDto: ReadProvinceDto = await this.provinceMapper.entityToDto(userEntity.province)
    const readMunicipatityDto: ReadMunicipalityDto = await this.municipalityMapper.entityToDto(userEntity.municipality)
    const dtoToString: string = userEntity.toString();
    return new ReadUserDto(
      dtoToString,
      userEntity.id,
      userEntity.username,
      userEntity.email,
      readRolDto,
      readFuncionDto,
      userEntity.phone,
      userEntity.expire,
      readPlanDto,
      readProvinceDto,
      readMunicipatityDto
    );
  }
}
