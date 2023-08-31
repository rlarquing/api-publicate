import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoMenuTypeEnum } from '../enum';

export class CreateMenuDto {
  @IsNotEmpty()
  @IsString({ message: 'El atributo label debe ser un texto' })
  @ApiProperty({
    description: 'Nombre del menu',
    example: 'Listado de los indicadores',
  })
  label: string;

  @IsNotEmpty()
  @IsString({ message: 'El atributo icon debe ser un texto' })
  @ApiProperty({
    description: 'Icono del menu',
    example: 'Book',
  })
  icon: string;
  @IsNotEmpty()
  @IsString({ message: 'El atributo to debe ser un texto' })
  @ApiProperty({
    description: 'Dirección hacia donde va el menu',
    example: '/home',
  })
  to: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Menu padre al cual pertenece',
    example: 1,
  })
  menu?: string;

  @IsNotEmpty()
  @IsString({ message: 'El atributo to debe ser un texto' })
  @ApiProperty({
    description: 'Tipo de menu',
    example: 'reporte',
  })
  tipo: TipoMenuTypeEnum;
}
