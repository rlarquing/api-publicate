import { Injectable } from '@nestjs/common';
import { ProductMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import { ProductEntity } from '../../persistence/entity';
import { ProductRepository } from '../../persistence/repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService extends GenericService<ProductEntity> {
  constructor(
    protected configService: ConfigService,
    protected productRepository: ProductRepository,
    protected productMapper: ProductMapper,
    protected trazaService: LogHistoryService,
  ) {
    super(configService, productRepository, productMapper, trazaService, true);
  }
}
