import {
  IsArray,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateMultiplePlanDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'id del plan.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'El nombre debe de tener al menos 4 carácteres.',
  })
  @MaxLength(255, {
    message: 'El nombre debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({ description: 'Nombre del plan.', example: 'Plan básico' })
  name: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'El atributo price debe ser un número' })
  @ApiProperty({
    description: 'Precio del plan.',
    example: 10,
  })
  price: number;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Permisos que tienen este plan.',
    example: ['f49e75f2-4359-4276-a148-3c10c5aae7fd', 'f49e75f2-4359-4276-a148-3c10c5aae7fa'],
  })
  permissions: string[];
}
