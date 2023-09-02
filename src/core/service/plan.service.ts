import { Injectable } from '@nestjs/common';
import { PlanMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import { PlanEntity } from '../../persistence/entity';
import { PlanRepository } from '../../persistence/repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlanService extends GenericService<PlanEntity> {
  constructor(
    protected configService: ConfigService,
    protected planRepository: PlanRepository,
    protected planMapper: PlanMapper,
    protected trazaService: LogHistoryService,
  ) {
    super(configService, planRepository, planMapper, trazaService, true);
  }
}
