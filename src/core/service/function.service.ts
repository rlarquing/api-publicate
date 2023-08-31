import { Injectable } from '@nestjs/common';
import { FunctionMapper } from '../mapper';
import { TrazaService } from './traza.service';
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
    protected trazaService: TrazaService,
  ) {
    super(configService, funcionRepository, funcionMapper, trazaService, true);
  }
}
