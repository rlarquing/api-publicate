import {
  IsArray, IsBoolean,
  IsNotEmpty, IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
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
  @MinLength(4, {
    message: 'La descripción debe de tener al menos 4 carácteres.',
  })
  @MaxLength(255, {
    message: 'La descripción debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({
    description: 'Descripción del nomenclador.',
    example: 'Alerta 1',
  })
  description: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'El atributo price debe ser un número' })
  @ApiProperty({
    description: 'Precio del producto.',
    example: 26,
  })
  price: number;

  @IsNotEmpty()
  @IsNumber({}, { message: 'El atributo amount debe ser un número' })
  @ApiProperty({
    description: 'Cantidad del producto.',
    example: 26,
  })
  amount: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Servicio a domicilio.', example: false })
  homeService: boolean;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Negocio al que pertenece el producto.',
    example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd',
  })
  business: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Tags que tienen este producto.',
    example: ['f49e75f2-4359-4276-a148-3c10c5aae7fd', 'f49e75f2-4359-4276-a148-3c10c5aae7fa'],
  })
  tags: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Provincias que puede brindar este producto.',
    example: ['f49e75f2-4359-4276-a148-3c10c5aae7fd', 'f49e75f2-4359-4276-a148-3c10c5aae7fa'],
  })
  provincies: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Municipios que puede brindar este producto.',
    example: ['f49e75f2-4359-4276-a148-3c10c5aae7fd', 'f49e75f2-4359-4276-a148-3c10c5aae7fa'],
  })
  municipalities: string[];
}
