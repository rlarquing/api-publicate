import { Injectable } from '@nestjs/common';
import { LogHistoryEntity } from '../../persistence/entity';
import { LogHistoryDto } from '../../shared/dto';

@Injectable()
export class LogHistoryMapper {
  entityToDto(logHistoryEntity: LogHistoryEntity): LogHistoryDto {
    return new LogHistoryDto(
      logHistoryEntity.id,
      logHistoryEntity.user.username,
      logHistoryEntity.date,
      logHistoryEntity.model,
      logHistoryEntity.data,
      logHistoryEntity.action,
      logHistoryEntity.record,
    );
  }
}
