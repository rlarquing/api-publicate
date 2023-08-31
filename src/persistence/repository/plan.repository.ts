import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ClientEntity, PlanEntity} from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class PlanRepository
  extends GenericRepository<PlanEntity>
  implements IRepository<PlanEntity>
{
  constructor(
    @InjectRepository(PlanEntity)
    private planRepository: Repository<PlanEntity>,
  ) {
    super(planRepository, ['permissions']);
  }
}
