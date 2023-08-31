import { Injectable } from '@nestjs/common';
import { EndPointMapper } from './end-point.mapper';
import {
  EndPointRepository,
  FunctionRepository,
  MenuRepository,
} from '../../persistence/repository';
import { MenuMapper } from './menu.mapper';
import {
  CreateFunctionDto,
  ReadEndPointDto,
  ReadFunctionDto,
  ReadMenuDto,
  UpdateFunctionDto,
} from '../../shared/dto';
import {
  EndPointEntity,
  FunctionEntity,
  MenuEntity,
} from '../../persistence/entity';

@Injectable()
export class FunctionMapper {
  constructor(
    protected funcionRepository: FunctionRepository,
    protected endPointRepository: EndPointRepository,
    protected endPointMapper: EndPointMapper,
    protected menuRepository: MenuRepository,
    protected menuMapper: MenuMapper,
  ) {}

  async dtoToEntity(
    createFuncionDto: CreateFunctionDto,
  ): Promise<FunctionEntity> {
    const endPoints: EndPointEntity[] = await this.endPointRepository.findByIds(
      createFuncionDto.endPoints,
    );
    if (createFuncionDto.menu !== undefined) {
      const menu: MenuEntity = await this.menuRepository.findById(
        createFuncionDto.menu,
      );
      return new FunctionEntity(
        createFuncionDto.name,
        createFuncionDto.description,
        endPoints,
        menu,
      );
    }

    return new FunctionEntity(
      createFuncionDto.name,
      createFuncionDto.description,
      endPoints,
    );
  }

  async dtoToUpdateEntity(
    updateFuncionDto: UpdateFunctionDto,
    updateFuncionEntity: FunctionEntity,
  ): Promise<FunctionEntity> {
    const endPoints: EndPointEntity[] = await this.endPointRepository.findByIds(
      updateFuncionDto.endPoints,
    );
    if (updateFuncionDto.menu !== undefined) {
      if (updateFuncionDto.menu !== null) {
        updateFuncionEntity.menu = await this.menuRepository.findById(
          updateFuncionDto.menu,
        );
      } else {
        updateFuncionEntity.menu = null;
      }
    }
    updateFuncionEntity.nombre = updateFuncionDto.name;
    updateFuncionEntity.descripcion = updateFuncionDto.description;
    updateFuncionEntity.endPoints = endPoints;

    return updateFuncionEntity;
  }

  async entityToDto(funcionEntity: FunctionEntity): Promise<ReadFunctionDto> {
    const funcion: FunctionEntity = await this.funcionRepository.findById(
      funcionEntity.id,
    );
    const endPoints: ReadEndPointDto[] = [];
    for (const endPoint of funcion.endPoints) {
      endPoints.push(await this.endPointMapper.entityToDto(endPoint));
    }
    let menu: ReadMenuDto;
    if (funcion.menu !== null) {
      menu = await this.menuMapper.entityToDto(funcion.menu);
    }
    const dtoToString: string = funcionEntity.toString();
    return new ReadFunctionDto(
      dtoToString,
      funcionEntity.id,
      funcionEntity.nombre,
      funcionEntity.descripcion,
      endPoints,
      menu,
    );
  }
}
