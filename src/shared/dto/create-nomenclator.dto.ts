import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateNomenclatorDto {
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
}
