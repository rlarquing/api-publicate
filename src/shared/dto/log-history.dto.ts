import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';

export class LogHistoryDto {
  @IsString()
  @ApiProperty({ description: 'id de la traza.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'Nombre del usuario.', example: 'Juan' })
  user: string;

  @IsDate()
  @ApiProperty({
    description: 'Fecha de la traza.',
    example: '2021-04-26 15:02:16.21585',
  })
  date: Date;

  @IsString()
  @ApiProperty({
    description: 'Nombre del modelo que se modifico.',
    example: 'RoleEntity',
  })
  model: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Datos que se introducieron.' })
  data: object;

  @IsNotEmpty()
  @ApiProperty({ description: 'Acción que se realizó.', example: 'ADD' })
  action: HISTORY_ACTION;

  @IsString()
  @ApiProperty({
    description: 'Registro que se modifico.',
    example: 'ab5e0f92-ea70-42fe-8722-bfe96dca36ef',
  })
  record: string;

  constructor(
    id: string,
    user: string,
    date: Date,
    model: string,
    data: object,
    action: HISTORY_ACTION,
    record: string,
  ) {
    this.id = id;
    this.user = user;
    this.date = date;
    this.model = model;
    this.data = data;
    this.action = action;
    this.record = record;
  }
}
