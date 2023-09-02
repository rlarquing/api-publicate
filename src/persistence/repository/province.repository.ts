import { ProvinceEntity } from '../entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ProvinceRepository {
  constructor(
    @InjectRepository(ProvinceEntity)
    private provinciaRepository: Repository<ProvinceEntity>,
  ) {}

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<ProvinceEntity>> {
    return await paginate<ProvinceEntity>(this.provinciaRepository, options);
  }

  async findById(id: string): Promise<ProvinceEntity> {
    const options = { id } as FindOptionsWhere<ProvinceEntity>;
    return await this.provinciaRepository.findOneBy(options);
  }

  async findByIds(ids: string[]): Promise<ProvinceEntity[]> {
    const options = {
      where: { id: In(ids) },
    } as FindManyOptions;
    return await this.provinciaRepository.find(options);
  }
}
