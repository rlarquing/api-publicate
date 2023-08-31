import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { ClientEntity} from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class ClientRepository
  extends GenericRepository<ClientEntity>
  implements IRepository<ClientEntity>
{
  constructor(
    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,
  ) {
    super(clientRepository, ['user']);
  }
}
