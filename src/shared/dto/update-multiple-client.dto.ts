import {
  IsNotEmpty, IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateMultipleClientDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'id del negocio.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'El nombre debe de tener al menos 4 carácteres.',
  })
  @MaxLength(255, {
    message: 'El nombre debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({ description: 'Nombre del cliente.', example: 'Pepe' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Apellidos del cliente.', example: 'Perez Perez' })
  lastName: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'El atributo age debe ser un número' })
  @ApiProperty({
    description: 'Años del cliente.',
    example: 26,
  })
  age: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Sexo del cliente.', example: 'M' })
  sex: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(11, {
    message: 'El Carnet de identidad debe de tener al menos 11 carácteres.',
  })
  @MaxLength(11, {
    message: 'El Carnet de identidad debe tener como máximo 11 carácteres.',
  })
  @ApiProperty({ description: 'Carnet de identidad del cliente.', example: '881114234621' })
  ci: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'El dirección del cliente debe de tener al menos 4 carácteres.',
  })
  @MaxLength(255, {
    message: 'El direcció del cliente debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({ description: 'Dirección del cliente.', example: 'Calle G #4' })
  addressClient: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Usuario que tienen este cliente.',
    example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd',
  })
  user: string;
}
