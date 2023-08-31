import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReadEndPointDto } from './read-end-point.dto';
import { ReadFunctionDto } from './read-function.dto';
import {ReadUserDto} from "./read-user.dto";
import {SelectDto} from "./select.dto";

export class ReadRolDto {
  @IsString({ message: 'El dtoToString debe de ser un string' })
  dtoToString: string;

  @ApiProperty({ description: 'id del rol.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @ApiProperty({ description: 'Nombre del rol.', example: 'Administrador' })
  name: string;

  @ApiProperty({
    description: 'Descripción del rol.',
    example: 'Tiene endPoint total del api',
  })
  description: string;

  @ApiProperty({ description: 'Usuarios que usan este rol.', type: [ReadUserDto] })
  users: SelectDto[];

  @ApiProperty({ description: 'Funciones del rol.', type: [ReadEndPointDto] })
  funcions: ReadFunctionDto[];

  constructor(
    dtoToString: string,
    id: string,
    name: string,
    description: string,
    users: SelectDto[],
    funcions: ReadFunctionDto[],
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.name = name;
    this.description = description;
    this.users = users;
    this.funcions = funcions;
  }
}
