import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDto } from './read-user.dto';

export class ReadClientDto {
  @IsString({ message: 'El dtoToString debe de ser un string' })
  dtoToString: string;

  @ApiProperty({ description: 'id del cliente.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @ApiProperty({ description: 'Nombre del cliente.', example: 'Pepe' })
  name: string;

  @ApiProperty({ description: 'Apellidos del cliente.', example: 'Perez Perez' })
  lastName: string;

  @ApiProperty({
    description: 'Años del cliente.',
    example: 26,
  })
  age: number;

  @ApiProperty({ description: 'Sexo del cliente.', example: 'M' })
  sex: string;

  @ApiProperty({ description: 'Carnet de identidad del cliente.', example: '881114234621' })
  ci: string;

  @ApiProperty({ description: 'Dirección del cliente.', example: 'Calle G #4' })
  addressClient: string;

  @ApiProperty({
    description: 'Usuario que tienen este negocio.',
    example: ReadUserDto,
  })
  user: ReadUserDto;


  constructor(dtoToString: string, id: string, name: string, lastName: string, age: number, sex: string, ci: string, addressClient: string, user: ReadUserDto) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.sex = sex;
    this.ci = ci;
    this.addressClient = addressClient;
    this.user = user;
  }
}
