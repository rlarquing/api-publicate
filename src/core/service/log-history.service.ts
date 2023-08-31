import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { LogHistoryMapper } from '../mapper';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { LogHistoryRepository } from '../../persistence/repository';
import { LogHistoryDto } from '../../shared/dto';
import { LogHistoryEntity, UserEntity } from '../../persistence/entity';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';

@Injectable()
export class LogHistoryService {
  constructor(
    private logHistoryRepository: LogHistoryRepository,
    private logHistoryMapper: LogHistoryMapper,
  ) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<LogHistoryDto>> {
    const logHistorys: Pagination<LogHistoryEntity> = await this.logHistoryRepository.findAll(
      options,
    );
    const logHistoryDto: LogHistoryDto[] = logHistorys.items.map((logHistory: LogHistoryEntity) =>
      this.logHistoryMapper.entityToDto(logHistory),
    );
    return new Pagination(logHistoryDto, logHistorys.meta, logHistorys.links);
  }

  async findById(id: string): Promise<LogHistoryDto> {
    const logHistory: LogHistoryEntity = await this.logHistoryRepository.findById(id);
    return this.logHistoryMapper.entityToDto(logHistory);
  }

  async create(
    user: UserEntity,
    entity: any,
    action: HISTORY_ACTION,
  ): Promise<void> {
    const logHistory: LogHistoryEntity = new LogHistoryEntity();
    logHistory.user = user;
    logHistory.model = entity.constructor.name;
    logHistory.data = entity;
    logHistory.action = action;
    logHistory.record = entity.id;
    await this.logHistoryRepository.create(logHistory);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.logHistoryRepository.delete(id);
  }

  async findByFiltrados(user: UserEntity, filtro: any): Promise<any> {
    return await this.logHistoryRepository.findByFiltrados(user, filtro);
  }
}
