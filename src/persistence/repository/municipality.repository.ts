import { MunicipalityEntity, ProvinceEntity } from '../entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class MunicipalityRepository {
  constructor(
    @InjectRepository(MunicipalityEntity)
    private municipioRepository: Repository<MunicipalityEntity>,
  ) {}

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<MunicipalityEntity>> {
    return await paginate<MunicipalityEntity>(this.municipioRepository, options);
  }

  async findById(id: string): Promise<MunicipalityEntity> {
    const options = {
      where: { id },
      relations: { provincia: true },
    } as FindOneOptions<MunicipalityEntity>;
    return await this.municipioRepository.findOne(options);
  }

  async findByIds(ids: string[]): Promise<MunicipalityEntity[]> {
    const options = {
      where: { id: In(ids) },
      relations: {
        provincia: true,
      },
    } as FindManyOptions<MunicipalityEntity>;
    return await this.municipioRepository.find(options);
  }

  async findByProvincia(
    provincia: ProvinceEntity | string,
  ): Promise<MunicipalityEntity[]> {
    const options = {
      where: {
        provincia: {
          id: provincia instanceof ProvinceEntity ? provincia.id : provincia,
        },
      },
      relations: {
        provincia: true,
      },
    } as FindManyOptions<MunicipalityEntity>;
    return await this.municipioRepository.find(options);
  }
}
