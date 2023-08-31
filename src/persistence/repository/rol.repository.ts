import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {FindOneOptions, Repository} from 'typeorm';
import { RolEntity } from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class RolRepository
  extends GenericRepository<RolEntity>
  implements IRepository<RolEntity>
{
  constructor(
    @InjectRepository(RolEntity)
    private rolRepository: Repository<RolEntity>,
  ) {
    super(rolRepository, ['users', 'functions']);
  }

  async findByName(name:string): Promise<RolEntity>{
    const options = {
      where: { name: name, active: true },
      relations: this.relations,
    } as FindOneOptions;
    return await this.repository.findOne(options);
  }
}
