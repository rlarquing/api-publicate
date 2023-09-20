import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEqualTo } from '../../api/decorator';
import { Type } from 'class-transformer';

export class CreateUserDto {
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
  @MaxLength(255, {
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
  @MaxLength(255, {
    message: 'La contraseña debe tener como máximo 255 carácteres.',
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
  @ApiProperty({
    description: 'Roles del usuario.',
    example: [
      'f49e75f2-4359-4276-a148-3c10c5aae7fg',
      'f49e75f2-4359-4276-a148-3c10c5aae7fw',
    ],
  })
  roles: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Funciones del usuario.',
    example: [
      'f49e75f2-4359-4276-a148-3c10c5aae7fq',
      'f49e75f2-4359-4276-a148-3c10c5aae7fd',
    ],
  })
  functions?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'El atributo phone debe ser un número' })
  @ApiPropertyOptional({
    description: 'Número de telefono.',
    example: 52037685,
  })
  phone?: number;

  @IsOptional()
  @IsDate({
    message: 'El atributo expire debe de ser formato válido',
  })
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'fecha de expiracion del usuario',
    example: '2023-07-08',
  })
  expire?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Plan al cual pertenece',
    example: '471406b8-6e95-4613-99cd-479d1050afff',
  })
  plan?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Provincia al cual pertenece',
    example: '471406b8-6e95-4613-99cd-479d1050affe',
  })
  province?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Municipio al cual pertenece',
    example: '471406b8-6e95-4613-99cd-479d1050affw',
  })
  municipality?: string;
}
