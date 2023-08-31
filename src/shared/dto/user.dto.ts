import {
  IsDate,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEqualTo } from '../../api/decorator';
import { Type } from 'class-transformer';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: 'El nombre debe de tener al menos 4 carácteres.',
  })
  @MaxLength(20, {
    message: 'El nombre debe de tener como máximo 20 carácteres.',
  })
  @ApiProperty({ description: 'Nombre del usuario.', example: 'juan' })
  username: string;

  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 carácteres.',
  })
  @MaxLength(20, {
    message: 'La contraseña debe tener como máximo 20 carácteres.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña es muy débil.',
  })
  @ApiProperty({
    description: 'Contraseña del usuario.',
    example: 'Qwerty1234*',
  })
  password: string;

  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 carácteres.',
  })
  @MaxLength(20, {
    message: 'La contraseña debe tener como máximo 20 carácteres.',
  })
  @ApiProperty({
    description: 'Confirmar contraseña del usuario.',
    example: 'Qwerty1234*',
  })
  @IsEqualTo('password')
  confirmPassword: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Email del usuario.',
    example: 'juan@camaguey.geocuba.cu',
  })
  email?: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'El atributo phone debe ser un número' })
  @ApiProperty({
    description: 'Número de telefono.',
    example: 52037685,
  })
  phone: number;

  @IsNotEmpty()
  @IsDate({
    message: 'El atributo expire debe de ser formato válido',
  })
  @Type(() => Date)
  @ApiProperty({
    description: 'fecha de expiracion del usuario',
    example: '2023-07-08',
  })
  expire: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Plan al cual pertenece',
    example: '471406b8-6e95-4613-99cd-479d1050afff',
  })
  plan: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Provincia al cual pertenece',
    example: '471406b8-6e95-4613-99cd-479d1050affe',
  })
  province: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Municipio al cual pertenece',
    example: '471406b8-6e95-4613-99cd-479d1050affw',
  })
  municipality: string;
}
