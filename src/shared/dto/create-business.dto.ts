import {
  IsArray,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'El nombre debe de tener al menos 4 carácteres.',
  })
  @MaxLength(255, {
    message: 'El nombre debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({ description: 'Nombre del negocio.', example: 'Tienda x' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'El dirección del negocio debe de tener al menos 4 carácteres.',
  })
  @MaxLength(255, {
    message: 'El dirección del negocio debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({ description: 'Dirección del negocio.', example: 'Calle G #4' })
  addressBusiness: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Usuario que tienen este negocio.',
    example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd',
  })
  user: string;
}
