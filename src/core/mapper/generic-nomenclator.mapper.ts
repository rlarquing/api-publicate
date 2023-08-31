import { Injectable } from '@nestjs/common';
import {
  CreateNomenclatorDto,
  ReadNomenclatorDto,
  UpdateNomenclatorDto,
} from '../../shared/dto';
import { GenericNomenclatorEntity } from '../../persistence/entity';

@Injectable()
export class GenericNomenclatorMapper {
  dtoToEntity(createNomencladorDto: CreateNomenclatorDto): any {
    return new GenericNomenclatorEntity(
      createNomencladorDto.name,
      createNomencladorDto.description,
    );
  }

  dtoToUpdateEntity(
    updateNomencladorDto: UpdateNomenclatorDto,
    updateEntity: any,
  ): any {
    updateEntity.name = updateNomencladorDto.name;
    updateEntity.description = updateNomencladorDto.description;
    return updateEntity;
  }

  entityToDto(nomencladorEntity: GenericNomenclatorEntity): ReadNomenclatorDto {
    return new ReadNomenclatorDto(
      nomencladorEntity.id,
      nomencladorEntity.name,
      nomencladorEntity.description,
      nomencladorEntity.toString(),
    );
  }
}
