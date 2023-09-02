import { Injectable } from '@nestjs/common';
import { BusinessMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import { BusinessEntity } from '../../persistence/entity';
import { BusinessRepository } from '../../persistence/repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BusinessService extends GenericService<BusinessEntity> {
  constructor(
    protected configService: ConfigService,
    protected businessRepository: BusinessRepository,
    protected businessMapper: BusinessMapper,
    protected trazaService: LogHistoryService,
  ) {
    super(configService, businessRepository, businessMapper, trazaService, true);
  }
}
