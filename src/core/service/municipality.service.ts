import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MunicipalityMapper } from '../mapper';
import {
  MunicipalityRepository,
} from '../../persistence/repository';
import { ReadMunicipalityDto } from '../../shared/dto';
import { MunicipalityEntity, ProvinceEntity } from '../../persistence/entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class MunicipalityService {
  constructor(
    private municipioRepository: MunicipalityRepository,
    private municipioMapper: MunicipalityMapper,
  ) {}

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<ReadMunicipalityDto>> {
    const municipios: Pagination<MunicipalityEntity> =
      await this.municipioRepository.findAll(options);
    const readMunicipioDto: ReadMunicipalityDto[] = [];
    for (const municipio of municipios.items) {
      readMunicipioDto.push(await this.municipioMapper.entityToDto(municipio));
    }
    return new Pagination(readMunicipioDto, municipios.meta, municipios.links);
  }

  async findById(id: string): Promise<ReadMunicipalityDto> {
    if (!id) {
      throw new BadRequestException('El id no puede ser vacio');
    }
    const municipio: MunicipalityEntity = await this.municipioRepository.findById(
      id,
    );
    if (!municipio) {
      throw new NotFoundException('El municipio no se encuentra.');
    }
    return this.municipioMapper.entityToDto(municipio);
  }

  async findByProvincia(provincia: string): Promise<ReadMunicipalityDto[]> {
    const municipios: MunicipalityEntity[] =
      await this.municipioRepository.findByProvincia(provincia);
    const readMunicipioDto: ReadMunicipalityDto[] = [];
    for (const municipio of municipios) {
      readMunicipioDto.push(await this.municipioMapper.entityToDto(municipio));
    }
    return readMunicipioDto;
  }
}
