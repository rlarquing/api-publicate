import { Injectable } from '@nestjs/common';
import { FunctionMapper } from './function.mapper';
import {
  FunctionRepository, GenericNomenclatorRepository,
  PlanRepository,
  UserRepository,
} from '../../persistence/repository';
import { FunctionEntity, PermissionEntity, PlanEntity, UserEntity } from '../../persistence/entity';
import {
  CreatePlanDto,
  ReadFunctionDto, ReadNomenclatorDto,
  ReadPlanDto,
  ReadUserDto,
  SelectDto,
  UpdatePlanDto,
} from '../../shared/dto';
import { NomenclatorTypeEnum } from '../../shared/enum';
import { GenericNomenclatorMapper } from './generic-nomenclator.mapper';

@Injectable()
export class PlanMapper {
  constructor(
    protected planRepository: PlanRepository,
    protected genericNomenclatorRepository: GenericNomenclatorRepository,
    protected genericNomenclatorMapper: GenericNomenclatorMapper
  ) {}
  async dtoToEntity(createPlanDto: CreatePlanDto): Promise<PlanEntity> {
    let permissions: PermissionEntity[] = [];
    if (createPlanDto.permissions != undefined) {
      permissions = await this.genericNomenclatorRepository.findByIds(NomenclatorTypeEnum.PERMISSION, createPlanDto.permissions);
    }
    return new PlanEntity(
      createPlanDto.name,
      createPlanDto.price,
      permissions,
    );
  }
  async dtoToUpdateEntity(
    updatePlanDto: UpdatePlanDto,
    updatePlanEntity: PlanEntity,
  ): Promise<PlanEntity> {
    if (updatePlanDto.permissions != undefined) {
      const permissions: PermissionEntity[] = await this.genericNomenclatorRepository.findByIds(NomenclatorTypeEnum.PERMISSION, updatePlanDto.permissions);

      if (permissions) {
        updatePlanEntity.permissions = permissions;
      }
    }

    updatePlanEntity.name = updatePlanDto.name;
    updatePlanEntity.price = updatePlanDto.price;

    return updatePlanEntity;
  }
  async entityToDto(planEntity: PlanEntity): Promise<ReadPlanDto> {
    const plan: PlanEntity = await this.planRepository.findById(planEntity.id);
    const permissionDto: ReadNomenclatorDto[] = [];
    for (const permission of plan.permissions) {
      permissionDto.push(this.genericNomenclatorMapper.entityToDto(permission));
    }

    const dtoToString: string = plan.toString();
    return new ReadPlanDto(
      dtoToString,
      planEntity.id,
      planEntity.name,
      planEntity.price,
     permissionDto
    );
  }
}
