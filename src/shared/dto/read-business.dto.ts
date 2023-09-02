import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDto } from './read-user.dto';

export class ReadBusinessDto {
  @IsString({ message: 'El dtoToString debe de ser un string' })
  dtoToString: string;

  @ApiProperty({ description: 'id del negocio.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @ApiProperty({ description: 'Nombre del negocio.', example: 'Empresa x' })
  name: string;

  @ApiProperty({ description: 'Dirección del negocio.', example: 'Calle G #4' })
  addressBusiness: string;

  @ApiProperty({
    description: 'Usuario que tienen este negocio.',
    example: ReadUserDto,
  })
  user: ReadUserDto;


  constructor(dtoToString: string, id: string, name: string, addressBusiness: string, user: ReadUserDto) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.name = name;
    this.addressBusiness = addressBusiness;
    this.user = user;
  }
}
