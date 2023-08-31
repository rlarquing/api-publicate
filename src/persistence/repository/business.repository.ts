import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BusinessEntity} from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class BusinessRepository
  extends GenericRepository<BusinessEntity>
  implements IRepository<BusinessEntity>
{
  constructor(
    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
  ) {
    super(businessRepository, ['user']);
  }
}
