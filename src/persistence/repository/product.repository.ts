import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ClientEntity, ProductEntity} from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class ProductRepository
  extends GenericRepository<ProductEntity>
  implements IRepository<ProductEntity>
{
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {
    super(productRepository, ['business', 'municipalities', 'provincies', 'tags']);
  }
}
