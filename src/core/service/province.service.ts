import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ProvinceMapper } from '../mapper';
import { ProvinceRepository } from '../../persistence/repository';
import { ReadProvinceDto } from '../../shared/dto';
import { ProvinceEntity } from '../../persistence/entity';

@Injectable()
export class ProvinceService {
  constructor(
    private provinciaRepository: ProvinceRepository,
    private provinciaMapper: ProvinceMapper,
  ) {}

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<ReadProvinceDto>> {
    const provincias: Pagination<ProvinceEntity> =
      await this.provinciaRepository.findAll(options);
    const readProvinciaDto: ReadProvinceDto[] = provincias.items.map(
      (provincia: ProvinceEntity) =>
        this.provinciaMapper.entityToDto(provincia),
    );
    return new Pagination(readProvinciaDto, provincias.meta, provincias.links);
  }

  async findById(id: string): Promise<ReadProvinceDto> {
    if (!id) {
      throw new BadRequestException('El id no puede ser vacio');
    }
    const provincia: ProvinceEntity = await this.provinciaRepository.findById(
      id,
    );
    if (!provincia) {
      throw new NotFoundException('La provincia no se encuentra.');
    }
    return this.provinciaMapper.entityToDto(provincia);
  }
}
