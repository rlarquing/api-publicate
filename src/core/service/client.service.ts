import { Injectable } from '@nestjs/common';
import { ClientMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import { ClientEntity } from '../../persistence/entity';
import { ClientRepository } from '../../persistence/repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientService extends GenericService<ClientEntity> {
  constructor(
    protected configService: ConfigService,
    protected clientRepository: ClientRepository,
    protected clientMapper: ClientMapper,
    protected trazaService: LogHistoryService,
  ) {
    super(configService, clientRepository, clientMapper, trazaService, true);
  }
}
