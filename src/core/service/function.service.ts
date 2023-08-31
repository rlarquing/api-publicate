import { Injectable } from '@nestjs/common';
import { FunctionMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import { FunctionEntity } from '../../persistence/entity';
import { FunctionRepository } from '../../persistence/repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FunctionService extends GenericService<FunctionEntity> {
  constructor(
    protected configService: ConfigService,
    protected funcionRepository: FunctionRepository,
    protected funcionMapper: FunctionMapper,
    protected trazaService: LogHistoryService,
  ) {
    super(configService, funcionRepository, funcionMapper, trazaService, true);
  }
}
