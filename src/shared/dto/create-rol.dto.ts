import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateRolDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'El nombre debe de tener al menos 4 carácteres.',
  })
  @MaxLength(255, {
    message: 'El nombre debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({ description: 'Nombre del rol.', example: 'Administrador' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Descripción del rol.',
    example: 'Tiene acceso total del api.',
  })
  description: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Usuarios que tienen este rol.',
    example: ['f49e75f2-4359-4276-a148-3c10c5aae7fd', 'f49e75f2-4359-4276-a148-3c10c5aae7fa'],
  })
  users?: string[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Funciones del rol.', example: ['f49e75f2-4359-4276-a148-3c10c5aae7fs', 'f49e75f2-4359-4276-a148-3c10c5aae7ff'] })
  functions?: string[];
}
