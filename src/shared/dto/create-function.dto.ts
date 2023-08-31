import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFunctionDto {
  @IsNotEmpty()
  @IsString({ message: 'El atributo nombre debe ser un strings' })
  @ApiProperty({
    description: 'Nombre de la función',
    example: 'Crear reportes',
  })
  name: string;
  @IsNotEmpty()
  @IsString({ message: 'El atributo descripcion debe ser un texto' })
  @ApiProperty({
    description: 'Descripción de la funcion',
    example: 'Crea reportes',
  })
  description: string;

  @IsArray({ message: 'El atributo endPoints debe de ser un arreglo' })
  @ApiProperty({
    description: 'Los endPoints necesarios para que esta funcion trabaje',
    example: [1],
  })
  endPoints: string[];

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Relacion con la entidad menu',
    example: 1,
  })
  menu?: string;
}
