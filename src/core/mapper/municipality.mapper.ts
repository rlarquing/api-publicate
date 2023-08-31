import { Injectable } from '@nestjs/common';
import { MunicipalityEntity } from '../../persistence/entity';
import { ReadMunicipalityDto, ReadProvinceDto } from '../../shared/dto';
import { MunicipalityRepository } from '../../persistence/repository';
import { ProvinceMapper } from './province.mapper';

@Injectable()
export class MunicipalityMapper {
  constructor(
    protected municipioRepository: MunicipalityRepository,
    protected provinciaMapper: ProvinceMapper,
  ) {}
  async entityToDto(
    municipioEntity: MunicipalityEntity,
  ): Promise<ReadMunicipalityDto> {
    const municipio: MunicipalityEntity = await this.municipioRepository.findById(
      municipioEntity.id,
    );
    const readProvinciaDto: ReadProvinceDto = this.provinciaMapper.entityToDto(
      municipio.province,
    );
    const dtoToString: string = municipioEntity.toString();
    return new ReadMunicipalityDto(
      dtoToString,
      municipioEntity.id,
      municipioEntity.name,
      readProvinciaDto,
    );
  }
}
