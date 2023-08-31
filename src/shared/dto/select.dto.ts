import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SelectDto {
  @IsNumber()
  @ApiProperty({ description: 'id', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  value: string;

  @IsString()
  @ApiProperty({ description: 'Nombre del nomenclador.', example: 'Nom 1' })
  label: string;

  constructor(id: string, nombre: string) {
    this.value = id;
    this.label = nombre;
  }
}
